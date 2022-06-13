var cat = { name: "A" };
function swap(feline) {
  feline.name = "Wild";
  feline = { name: "T" };
}
swap(cat);
console.log(cat.name);
