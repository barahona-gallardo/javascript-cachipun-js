$(document).ready(function () {
  // Core game object
  const game = {
    started: false,
    alerts_enabled: true,
    input: document.getElementById("input"),
    remaining: document.getElementById("remaining"),
    elements: ["rock", "paper", "scissors"],
    // Game execution
    play(userElement) {
      const computerElement = this.elements[Math.floor(Math.random() * 3)];
      if (
        (userElement === "rock" && computerElement === "scissors") ||
        (userElement === "paper" && computerElement === "rock") ||
        (userElement === "scissors" && computerElement === "paper")
      ) {
        score.register("win");
        alerts.trigger("win");
      } else if (userElement === computerElement) {
        score.register("stall");
        alerts.trigger("stall");
      } else {
        score.register("lose");
        alerts.trigger("lose");
      }
    },
    // Game reset
    reset() {
      $("#controls, #toggle, #remaining, #scores").addClass("d-none");
      alerts.clear();
      score.computer.textContent = "0";
      score.draw.textContent = "0";
      score.user.textContent = "0";
      this.input.value = "";
      $("#input, #tutorial").removeClass("d-none");
      $("#start").text("Iniciar");
      game.started = false;
    },
  };

  // Score management
  const score = {
    user: document.getElementById("userScore"),
    draw: document.getElementById("drawScore"),
    computer: document.getElementById("computerScore"),
    // Score registration
    register(score) {
      switch (score) {
        case "win":
          this.user.textContent = parseInt(this.user.textContent) + 1;
          break;
        case "stall":
          this.draw.textContent = parseInt(this.draw.textContent) + 1;
          break;
        case "lose":
          this.computer.textContent = parseInt(this.computer.textContent) + 1;
          break;
        default:
          alerts.trigger("cheating");
      }
    },
  };

  // Alerts management & interface
  const alerts = {
    message: $("#alerts"),
    // Alerts render
    render(type, message) {
      this.message.html([
        `<div class="alert alert-${type} alert-dismissible col-8 col-sm-5 col-md-4 col-lg-3 mx-auto" role="alert">`,
        `<span>${message}</span>`,
        `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`,
        `</div>`,
      ].join(""));
    },
    clear() {
      this.message.html("");
    },
    // Alerts trigger
    trigger(score) {
      if (game.alerts_enabled) {
        this.clear();
        switch (score) {
          case "victory":
            this.render("info", "Ganaste el juego!");
            break;
          case "draw":
            this.render("warning", "Empataste el juego!");
            break;
          case "defeat":
            this.render("secondary", "Perdiste el juego!");
            break;
          case "win":
            this.render("primary", "Ganaste este round.");
            break;
          case "stall":
            this.render("success", "Empataste este round.");
            break;
          case "lose":
            this.render("danger", "Perdiste este round.");
            break;
          default:
            this.render(
              "dark",
              "Buen intento, pero sabemos que intentaste inyectar código para hacer trampa."
            );
        }
      }
    },
    // Alerts switch
    toggle(mode) {
      switch (mode) {
        case "on":
          game.alerts_enabled = true;
          $("#alertsToggle").text("Desactivar alertas");
          break;
        case "off":
          alerts.clear();
          game.alerts_enabled = false;
          $("#alertsToggle").text("Activar alertas");
      }
    },
  };

  // Core game script
  $("#start").on("click", function (event) {
    event.preventDefault();
    $("#rock, #paper, #scissors").off("click");
    let rounds = parseInt(game.input.value);
    // Game start & interface unfolding
    if (!game.started && rounds >= 1) {
      $("#input, #tutorial").addClass("d-none");
      game.remaining.textContent = rounds;
      $("#remaining, #controls, #toggle").removeClass("d-none");
      $(this).text("Reiniciar");
      game.started = true;
      // Game reset & interface folding
    } else if (game.started) {
      game.reset();
      // Exception alert
    } else {
      alert("Por favor ingrese un número natural (número entero y positivo).");
    }
    // Game controls & execution
    $("#rock, #paper, #scissors").on("click", function (event) {
      event.preventDefault();
      rounds--;
      game.remaining.textContent = rounds;
      game.play($(this).attr("id"));
      $("#scores").removeClass("d-none");
      if (rounds === 0) {
        $("#controls").addClass("d-none");
        if (score.user.textContent > score.computer.textContent) {
          alerts.trigger("victory");
        } else if (score.user.textContent === score.computer.textContent) {
          alerts.trigger("draw");
        } else if (score.computer.textContent > score.user.textContent) {
          alerts.trigger("defeat");
        } else {
          alerts.trigger("cheating");
        }
      }
    });
  });

  // Alerts toggle button
  $("#alertsToggle").on("click", function (event) {
    event.preventDefault();
    if (game.alerts_enabled) {
      alerts.toggle("off");
    } else if (!game.alerts_enabled) {
      alerts.toggle("on");
    }
  });
});
