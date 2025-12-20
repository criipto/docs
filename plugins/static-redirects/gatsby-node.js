const fs = require('node:fs');
const path = require('node:path');
const redirects = [
  'https://docs.criipto.com/*  https://docs.idura.app/:splat  301!'
];

exports.onPostBuild = ({ reporter, basePath, pathPrefix }) => {
  const redirectsPath = path.resolve(`${__dirname}/../../public/_redirects`);
  let input = "";
  if (fs.existsSync(redirectsPath)) {
    input = fs.readFileSync(redirectsPath, "utf-8");
  }
  const output = `${input}\n${redirects.join('\n')}`;
  console.log(output);
  fs.writeFileSync(redirectsPath, output);
}