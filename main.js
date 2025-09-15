import Template from './lib/template.js';
import VMBrowser from './lib/vm_browser.js';

const template = new Template(VMBrowser);
export default { ...template.exports() };
