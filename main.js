import Template from './lib/template.js';
import VM from './lib/vm.js';

const template = new Template(VM);
const { compile, render } = template.exports();
export { Template, template, compile, render };
