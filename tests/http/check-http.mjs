import assert from 'node:assert/strict';
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
const url = new URL('/api/academia', base);
// Apenas pedidos inválidos: não grava nem remove dados da instância.
const scenarios = [
 ['origem local aceita',400,'{}',{'content-type':'application/json',origin:url.origin}],
 ['origem externa recusada',403,'{}',{'content-type':'application/json',origin:'https://example.test'}],
 ['formato incorreto',415,'{}',{'content-type':'text/plain'}],
 ['JSON inválido',400,'{',{'content-type':'application/json'}],
 ['array recusado',400,'[]',{'content-type':'application/json'}],
 ['corpo acima de 8 KB',413,JSON.stringify({extra:'x'.repeat(8300)}),{'content-type':'application/json'}],
 ['campos inválidos',422,JSON.stringify({action:'enroll',planId:'plus',name:'',email:'al01@example.test',terms:true}),{'content-type':'application/json'}]
];
for (const [name,status,body,headers] of scenarios) {
 const response=await fetch(url,{method:'POST',body,headers});
 assert.equal(response.status,status,name+': '+await response.text());
 console.log('APROVADO: '+name+' → '+status);
}
console.log('7 verificações HTTP aprovadas.');
