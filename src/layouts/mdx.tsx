import React from 'react';

import Navigation from '../components/Navigation';
import Header from '../components/Header';
import CustomMDXProvider, {textToId} from '../components/MdxProvider';

interface Header {
  type: 'h2' | 'h3',
  text: string
}

export default function MdxLayout(props: {children: React.ReactNode, pageContext: any, path: string}) {
  const {frontmatter} = props.pageContext;
  const headers : Header[] =
    React.Children.toArray(props.children)
    .filter((child: any) => child.props.mdxType === "h2" || child.props.mdxType === "h3")
    .map((child: any) => ({type: child.props.mdxType, text: child.props.children}));

  return (
    <div>
      <Header />
      <div className="px-4 sm:px-6 md:px-8">
        <div className="hidden lg:block fixed z-20 inset-0 top-[61px] left-[max(0px,calc(50%-42rem))] right-auto w-[19.5rem] py-10 px-8 overflow-y-auto">
          <Navigation />
        </div>
        <div className="lg:pl-[19.5rem]">
          <div className="max-w-5xl mx-auto pt-10">
            <div className="xl:pr-8 xl:mr-[19.5rem]">
              {frontmatter && (
                <header id="header" className="relative z-20">
                  <div>
                    {frontmatter.category && (<p className="mb-2 text-m leading-6 font-roboto-slab font-semibold text-blue">{frontmatter.category}</p>)}
                    <h1 className="inline-block text-3xl font-extrabold text-gray-900 tracking-tight">{frontmatter.title}</h1>
                  </div>
                  {frontmatter.subtitle && (<p className="mt-2 text-lg text-gray-700 max-w-screen-sm">{frontmatter.subtitle}</p>)}
                </header>
              )}
              <div className="relative z-20 prose max-w-none mt-8">
                <CustomMDXProvider>
                  {props.children}
                </CustomMDXProvider>
              </div>
              
              {headers && headers.length ? (
                <div className="fixed z-20 top-[3.8125rem] bottom-0 right-[max(0px,calc(50%-42rem))] w-[19.5rem] py-10 px-8 overflow-y-auto hidden xl:block">
                  <h5 className="text-blue font-semibold mb-4 text-m leading-6">On this page</h5>
                  <ul className="text-gray-700 text-sm leading-6">
                    {headers.map(header => (
                      <li key={textToId(header.text)} className={header.type === 'h3' && `ml-4`}>
                        <a href={`#${textToId(header.text)}`} className="group flex items-start block py-1 hover:text-blue">
                          {header.type === 'h3' && (
                            <svg width="3" height="24" viewBox="0 -9 3 24" className="mr-2 text-gray-400 overflow-visible group-hover:text-gray-600 dark:text-gray-600 dark:group-hover:text-gray-500">
                              <path d="M0 0L3 3L0 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                            </svg>
                          )}
                          {header.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}