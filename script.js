document.addEventListener("DOMContentLoaded", () => {
  const btnUsers = document.getElementById("btnUsers");
  const btnPokemon = document.getElementById("btnPokemon");
  const usersContainer = document.getElementById("usersContainer");
  const pokemonContainer = document.getElementById("pokemonContainer");

  btnUsers.addEventListener("click", async () => {
    usersContainer.innerHTML = "<p>Завантаження...</p>";
    pokemonContainer.classList.add("hidden");

    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      const users = await res.json();

      usersContainer.innerHTML = users.map(user => `
        <div class="user-box">
          <h3>${user.name}</h3>
          <p><strong>Логін:</strong> ${user.username}</p>
          <p><strong>Email:</strong> <a href="mailto:${user.email}">${user.email}</a></p>
          <p><strong>Телефон:</strong> ${user.phone}</p>
          <p><strong>Місто:</strong> ${user.address.city}</p>
          <p><strong>Компанія:</strong> ${user.company.name}</p>
          <p><strong>Сайт:</strong> <a href="http://${user.website}" target="_blank">${user.website}</a></p>
        </div>
      `).join("");
    } catch (err) {
      usersContainer.innerHTML = `<p style="color:red;">Помилка: ${err.message}</p>`;
    }
  });

  btnPokemon.addEventListener("click", async () => {
    const query = prompt("Введіть ім’я або ID покемона:");
    if (!query) return;

    pokemonContainer.classList.remove("hidden");
    usersContainer.innerHTML = "";

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
      if (!res.ok) throw new Error("Покемон не знайдений");

      const data = await res.json();
      const { name, sprites, stats, types } = data;

      const img = sprites.other["official-artwork"].front_default;
      const type = types[0].type.name.toLowerCase();

      const statMap = {
        hp: stats[0].base_stat,
        attack: stats[1].base_stat,
        defense: stats[2].base_stat,
        speed: stats[5].base_stat,
      };

      pokemonContainer.innerHTML = `
        <div class="pokemon-card type-${type}">
          <div class="pokemon-image-wrapper">
            <img src="${img}" alt="${name}">
          </div>
          <h2>${name.charAt(0).toUpperCase() + name.slice(1)}</h2>
          <span class="label">${type}</span>
          <div class="stats-grid">
            <div class="stat-item stat-hp"><span>HP</span><span>${statMap.hp}</span></div>
            <div class="stat-item stat-attack"><span>Attack</span><span>${statMap.attack}</span></div>
            <div class="stat-item stat-defense"><span>Defense</span><span>${statMap.defense}</span></div>
            <div class="stat-item stat-speed"><span>Speed</span><span>${statMap.speed}</span></div>
          </div>
        </div>
      `;
    } catch (err) {
      pokemonContainer.innerHTML = `<p style="color:red;">Помилка: ${err.message}</p>`;
    }
  });
});
