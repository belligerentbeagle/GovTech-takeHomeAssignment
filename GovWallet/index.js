const Person = require('./person');
const person1 = new Person('John Doe', 30);
person1.greeting();

const os = require('os');

console.log('Platform: ', os.platform());
console.log('cpu', os.cpus());