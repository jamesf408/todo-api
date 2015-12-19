var person = {
	name: 'James',
	age: 30
}

function updatePerson(obj) {
	// obj = {
	// 	name: 'James',
	// 	age: 34
	// }
	obj.age = 35;
}

updatePerson(person);

console.log(person);

var grades = [40,30];

function updateGrades(grades) {
	// grades.push(43);

	grades = [34, 21, 00];
}

updateGrades(grades);

console.log(grades);