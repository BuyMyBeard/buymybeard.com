
const footer = fetch('partial/footer.html').then(response => response.text());
const navigation = fetch('partial/navigation.html').then(response => response.text());

document.addEventListener("DOMContentLoaded", () => {
  footer.then(data => {
    document.getElementById('footer').innerHTML = data;
  });

  navigation.then(data => {
    document.getElementById('navigation').innerHTML = data;
  });
});