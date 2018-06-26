export default {
  particles: {
    number: {
      value: 70,
      density: {
        enable: true,
        value_area: 1000
      }
    },
    color: {
      value: "#ffffff"
    },
    shape: {
      type: "circle"
    },
    opacity: {
      value: 0.8,
      random: true,
      anim: {
        enable: true,
        speed: 0.2,
        opacity_min: 0.2,
        sync: false
      }
    },
    size: {
      value: 1.4,
      random: true,
    },
    line_linked: {
      enable: false,
      distance: 250,
      color: "#ffffff",
      opacity: 0.1,
      width: 1
    },
    move: {
      enable: true,
      speed: 0.7
    }
  },
  interactivity: {
    detect_on: "window",
    events: {
      onhover: {
        enable: true,
        mode: "grab"
      },
      onclick: {
        enable: true,
        mode: "repulse"
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 150,
        line_linked: {
          opacity: 0.2
        }
      },
      bubble: {
        distance: 400,
        size: 1.5,
        duration: 2,
        speed: 3
      },
      repulse: {
        distance: 200,
        duration: 15
      }
    }
  },
  retina_detect: true
}