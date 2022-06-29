import "./scss/style.scss";

const userStack = {
    language: "Javascript",
    framework: "React",
};

const user = {
    name: "Danil",
    age: "30",
    ...userStack,
};

console.log(user);
