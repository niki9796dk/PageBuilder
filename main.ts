import {DocumentNode} from "./src/Ast/Elements/DocumentNode";
import * as fs from "fs";


const content = fs.readFileSync("./ast.json", "utf8");
const ast = JSON.parse(content);

const document = new DocumentNode(ast);

console.log(document.toHtml());
// fs.writeFileSync('./index.html', document.toHtml());

// console.log(document.toHtml());
