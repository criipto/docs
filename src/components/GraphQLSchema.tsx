import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  astFromValue,
  buildClientSchema,
  GraphQLArgument,
  GraphQLField,
  GraphQLInputField,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLType,
  IntrospectionQuery,
  isAbstractType,
  isEnumType,
  isInputObjectType,
  isInterfaceType,
  isListType,
  isNonNullType,
  isObjectType,
  isScalarType,
  print,
  ValueNode,
} from 'graphql';

import './GraphQLSchema.css';
import jsonSchema from '../../graphql-signatures-schema.json';

const schema = buildClientSchema(jsonSchema.data as any as IntrospectionQuery);
const queryType = schema.getQueryType()!;
const mutationType = schema.getMutationType()!;
const typeMap = schema.getTypeMap();

export default function GraphQLSchemaComponent() {
  const [stack, setStack] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];

    const hash = window.location.hash.startsWith('#') ? window.location.hash.substring(1) : '';
    const parts = hash.split('/').filter(id => id);
    return parts;
  });
  const push = useCallback(
    (typeName: string) => {
      setStack(stack => stack.concat([typeName]));
    },
    [setStack],
  );
  const handleSelectType = (typeName: string) => {
    push(typeName);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.location.hash = stack.length ? stack.join('/') : '';
  }, [stack]);

  const { selectedType, selectedField } = useMemo(() => {
    const current = stack[stack.length - 1] ? stack[stack.length - 1] : null;
    const parent = current && stack.indexOf(current) > 0 ? stack[stack.indexOf(current) - 1] : null;
    if (!current) return {};
    const selectedType = typeMap[current];
    if (selectedType) return { selectedType };

    if (
      parent &&
      typeMap[parent] &&
      (isObjectType(typeMap[parent]) ||
        isInterfaceType(typeMap[parent]) ||
        isInputObjectType(typeMap[parent]))
    ) {
      return {
        selectedField: {
          field: current,
          parent: typeMap[parent],
        },
      };
    }
    return {};
  }, [stack]);

  const breadcrumb =
    stack.length > 0 ? (
      <div className="flex flex-row gap-2">
        {['Schema'].concat(stack.slice(0, stack.length - 1)).map((item, index) => (
          <React.Fragment key={index}>
            {index !== 0 ? <>&gt;</> : null}
            <a
              className="graphiql-doc-explorer-back"
              href="#"
              onClick={() => setStack(stack => stack.slice(0, index))}
            >
              {item}
            </a>
          </React.Fragment>
        ))}
      </div>
    ) : (
      <></>
    );

  return (
    <>
      <div className="graphiql-container graphql-schema" style={{ display: 'block' }}>
        <section className="graphiql-doc-explorer">
          {selectedType ? (
            <TypeDocumentation
              type={selectedType}
              onSelectType={handleSelectType}
              breadcrumb={breadcrumb}
            />
          ) : selectedField ? (
            <FieldDocumentation
              field={selectedField}
              onSelectType={handleSelectType}
              breadcrumb={breadcrumb}
            />
          ) : (
            <SchemaDocumentation onSelectType={handleSelectType} />
          )}
        </section>
      </div>
    </>
  );
}

function FieldDocumentation(props: {
  onSelectType: (typeName: string) => void;
  field: {
    field: string;
    parent: GraphQLObjectType | GraphQLInterfaceType | GraphQLInputObjectType;
  };
  breadcrumb: React.ReactNode;
}) {
  const {
    field: { field: fieldName, parent },
  } = props;
  const fieldType = parent.getFields()[fieldName]!;
  const args: readonly GraphQLArgument[] = 'args' in fieldType ? fieldType.args : [];
  return (
    <>
      <div className="graphiql-doc-explorer-header">
        <div className="graphiql-doc-explorer-header-content">
          {props.breadcrumb}
          <div className="graphiql-doc-explorer-title">{fieldName}</div>
        </div>
      </div>
      <div className="graphiql-doc-explorer-content">
        {fieldType.description ? (
          <div className="graphiql-markdown-description">{fieldType.description}</div>
        ) : null}
        <div>
          <div className="graphiql-doc-explorer-section-title">Type</div>
          <div className="graphiql-doc-explorer-section-content">
            <TypeLink type={fieldType.type} onSelect={props.onSelectType} />
          </div>
        </div>
        {args.length ? (
          <div>
            <div className="graphiql-doc-explorer-section-title">Arguments</div>
            <div className="graphiql-doc-explorer-section-content">
              {args.map(arg => (
                <Argument
                  key={arg.name}
                  arg={arg}
                  onSelect={props.onSelectType}
                  inline={false}
                  showDefaultValue={true}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

function TypeDocumentation(props: {
  onSelectType: (typeName: string) => void;
  type: GraphQLNamedType;
  breadcrumb: React.ReactNode;
}) {
  const { type } = props;
  return (
    <>
      <div className="graphiql-doc-explorer-header">
        <div className="graphiql-doc-explorer-header-content">
          {props.breadcrumb}
          <div className="graphiql-doc-explorer-title">{type.name}</div>
        </div>
      </div>
      <div className="graphiql-doc-explorer-content">
        {type.description ? (
          <div className="graphiql-markdown-description">{type.description}</div>
        ) : null}
        <ImplementsInterfaces type={type} onSelect={props.onSelectType} />
        {isEnumType(type) ? (
          <>
            {type.getValues().map(value => (
              <div className="graphiql-doc-explorer-item" key={value.name}>
                <div className="graphiql-doc-explorer-enum-value">{value.name}</div>
                {/** @TODO: description/deprecation */}
              </div>
            ))}
          </>
        ) : isObjectType(type) || isInterfaceType(type) || isInputObjectType(type) ? (
          <Fields type={type} onSelectType={props.onSelectType} />
        ) : null}
        <PossibleTypes type={type} onSelect={props.onSelectType} />
      </div>
    </>
  );
}

function Fields(props: {
  onSelectType: (typeName: string) => void;
  type: GraphQLObjectType | GraphQLInterfaceType | GraphQLInputObjectType;
}) {
  const { type } = props;
  const fieldMap = type.getFields();
  const fields = Object.keys(fieldMap).map(name => fieldMap[name]!);

  return (
    <>
      <ExplorerSection title="Fields">
        {fields.map(field => (
          <Field field={field} onSelect={props.onSelectType} key={field.name} />
        ))}
      </ExplorerSection>
    </>
  );
}

const Field = ({ field, onSelect }: { field: FieldDef; onSelect: (name: string) => void }) => {
  const args = 'args' in field ? field.args.filter(arg => !arg.deprecationReason) : [];
  return (
    <div className="graphiql-doc-explorer-item">
      <div>
        <FieldLink field={field} onSelect={onSelect} />
        {args.length > 0 ? (
          <>
            (
            <span>
              {args.map(arg =>
                args.length === 1 ? (
                  <Argument key={arg.name} arg={arg} inline onSelect={onSelect} />
                ) : (
                  <div key={arg.name} className="graphiql-doc-explorer-argument-multiple">
                    <Argument arg={arg} inline onSelect={onSelect} />
                  </div>
                ),
              )}
            </span>
            )
          </>
        ) : null}
        {': '}
        <TypeLink type={field.type} onSelect={onSelect} />
        <DefaultValue field={field} />
      </div>
      {field.description ? (
        <div className="graphiql-markdown-description graphiql-markdown-preview">
          {field.description}
        </div>
      ) : null}
      <DeprecationReason>{field.deprecationReason}</DeprecationReason>
    </div>
  );
};

const ImplementsInterfaces = ({
  type,
  onSelect,
}: {
  type: GraphQLNamedType;
  onSelect: (typeName: string) => void;
}) => {
  if (!isObjectType(type)) {
    return null;
  }
  const interfaces = type.getInterfaces();
  return interfaces.length > 0 ? (
    <ExplorerSection title="Implements">
      {type.getInterfaces().map(implementedInterface => (
        <div key={implementedInterface.name}>
          <TypeLink type={implementedInterface} onSelect={onSelect} />
        </div>
      ))}
    </ExplorerSection>
  ) : null;
};

const PossibleTypes = ({
  type,
  onSelect,
}: {
  type: GraphQLNamedType;
  onSelect: (typeName: string) => void;
}) => {
  if (!isAbstractType(type)) {
    return null;
  }
  return (
    <ExplorerSection title={isInterfaceType(type) ? 'Implementations' : 'Possible Types'}>
      {schema.getPossibleTypes(type).map(possibleType => (
        <div key={possibleType.name}>
          <TypeLink type={possibleType} onSelect={onSelect} />
        </div>
      ))}
    </ExplorerSection>
  );
};

function SchemaDocumentation(props: { onSelectType: (typeName: string) => void }) {
  const ignoreTypesInAllSchema = [queryType?.name, mutationType?.name];

  return (
    <div className="graphiql-doc-explorer-content">
      <div>
        <div className="graphiql-doc-explorer-section-title">Root Types</div>
        <div className="graphiql-doc-explorer-section-content">
          <div>
            <span className="graphiql-doc-explorer-root-type">query</span>
            {': '}
            <TypeLink type={queryType} onSelect={props.onSelectType} />
          </div>
          <div>
            <span className="graphiql-doc-explorer-root-type">mutation</span>
            {': '}
            <TypeLink type={mutationType} onSelect={props.onSelectType} />
          </div>
        </div>
      </div>
      <div>
        <div className="graphiql-doc-explorer-section-title">All Schema Types</div>
        <div className="graphiql-doc-explorer-section-content">
          <div>
            {Object.values(typeMap)
              .sort((a, b) => {
                if (isScalarType(a) && !isScalarType(b)) return -1;
                if (!isScalarType(a) && isScalarType(b)) return 1;
                return a.name.localeCompare(b.name);
              })
              .map(type => {
                if (ignoreTypesInAllSchema.includes(type.name) || type.name.startsWith('__')) {
                  return null;
                }

                return (
                  <div key={type.name}>
                    <TypeLink type={type} onSelect={props.onSelectType} />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

const Argument = ({
  arg,
  showDefaultValue,
  inline,
  onSelect,
}: {
  arg: GraphQLArgument;
  showDefaultValue?: boolean;
  inline?: boolean;
  onSelect: (name: string) => void;
}) => {
  const definition = (
    <span>
      <span className="graphiql-doc-explorer-argument-name">{arg.name}</span>
      {': '}
      <TypeLink type={arg.type} onSelect={onSelect} />
      {showDefaultValue !== false && <DefaultValue field={arg} />}
    </span>
  );
  if (inline) {
    return definition;
  }
  return (
    <div className="graphiql-doc-explorer-argument">
      {definition}
      {arg.description ? (
        <div className="graphiql-markdown-description graphiql-markdown-preview">
          {arg.description}
        </div>
      ) : null}
      {arg.deprecationReason ? (
        <div className="graphiql-doc-explorer-argument-deprecation">
          <div className="graphiql-doc-explorer-argument-deprecation-label">Deprecated</div>
          <div className="graphiql-markdown-deprecation graphiql-markdown-preview">
            {arg.deprecationReason}
          </div>
        </div>
      ) : null}
    </div>
  );
};

const TypeLink = ({ type, onSelect }: { type: GraphQLType; onSelect: (name: string) => void }) => {
  return renderType(type, def => (
    <a
      className="graphiql-doc-explorer-type-name"
      onClick={event => {
        event.preventDefault();
        onSelect(def.name);
      }}
      href="#"
    >
      {def.name}
    </a>
  ));
};

type FieldDef = GraphQLField<unknown, unknown> | GraphQLInputField | GraphQLArgument;
const FieldLink = ({ field, onSelect }: { field: FieldDef; onSelect: (name: string) => void }) => {
  return (
    <a
      className="graphiql-doc-explorer-field-name"
      onClick={event => {
        event.preventDefault();
        onSelect(field.name);
      }}
      href="#"
    >
      {field.name}
    </a>
  );
};

const DefaultValue = ({ field }: { field: FieldDef }) => {
  if (!('defaultValue' in field) || field.defaultValue === undefined) {
    return null;
  }
  const ast = astFromValue(field.defaultValue, field.type);
  if (!ast) {
    return null;
  }
  return (
    <>
      {' = '}
      <span className="graphiql-doc-explorer-default-value">{printDefault(ast)}</span>
    </>
  );
};

const printDefault = (ast?: ValueNode | null): string => {
  if (!ast) {
    return '';
  }
  return print(ast);
};

function renderType(
  type: GraphQLType,
  renderNamedType: (namedType: GraphQLNamedType) => JSX.Element,
): JSX.Element {
  if (isNonNullType(type)) {
    return <>{renderType(type.ofType, renderNamedType)}!</>;
  }
  if (isListType(type)) {
    return <>[{renderType(type.ofType, renderNamedType)}]</>;
  }
  return renderNamedType(type);
}

const DeprecationReason = (props: { children?: React.ReactNode | string }) => {
  return props.children ? (
    <div className="graphiql-doc-explorer-deprecation">
      <div className="graphiql-doc-explorer-deprecation-label">Deprecated</div>
      <div className="graphiql-markdown-deprecation graphiql-markdown-preview">
        {props.children}
      </div>
    </div>
  ) : null;
};

const ExplorerSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <div>
      <div className="graphiql-doc-explorer-section-title">{title}</div>
      <div className="graphiql-doc-explorer-section-content">{children}</div>
    </div>
  );
};
