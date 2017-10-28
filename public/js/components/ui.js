// -----------------------------------------------------------------------------
// UI Logic
// -----------------------------------------------------------------------------

$(document).ready(function(){

ui = {
  interval: null,
  allowCycling: true,
  currentThemeColor: null,
  currentAccentColor: null,

  getNextColor: function(){
    return themeColors[Math.floor(Math.random()*themeColors.length)];
  },

  cycleColor: function() {
    if (this.allowCycling) {
      if (app.lightingMode === LIGHTING_MODE_NIGHT) {
        this.currentThemeColor = customTheme || this.getNextColor();
        this.currentAccentColor = DEFAULT_ACCENT_COLOR;
      } else {
        this.currentThemeColor = DEFAULT_ACCENT_COLOR;
        this.currentAccentColor = customTheme || this.getNextColor();
      }
      ui.setAppColors(this.currentThemeColor, this.currentAccentColor);
    }
  },

  invertColor: function() {
    var origThemeColor = this.currentThemeColor;
    this.currentThemeColor = this.currentAccentColor;
    this.currentAccentColor = origThemeColor;
    ui.setAppColors(this.currentThemeColor, this.currentAccentColor);
  },

  startCycle: function() {
    ui.cycleColor();
    this.interval = setInterval(function(){
      ui.cycleColor();
    }, 10000);
  },

  stopCycle: function() {
    this.currentColorIdx = 0;
    ui.cycleColor();
    clearInterval(this.interval);
  },

  setAppColors: function(theme, accent) {
    sectionA.css({"color": theme});
    contentTask.css({"color": theme});
    sectionAContainer.css("background-color", accent);
    sectionB.css({"background-color": theme, "color": accent});
    sectionC.css({"background-color": accent, "color": theme});
    actionButtons.css({"color": theme});
    footer.css({"color": theme});
    activityLogContainer.css({"background-color": accent, "color": theme});
    activityLogPanel.css({"border-color": theme});

    // SVG Elements
    $(".line").css({"stroke": theme});
    $(".grid line, .grid path").css({"stroke": theme});
  },

  setPickedColor: function(color) {
    if (app.lightingMode === LIGHTING_MODE_NIGHT) {
      this.currentThemeColor = color;
    } else {
      this.currentAccentColor = color;
    }
    this.setAppColors(this.currentThemeColor, this.currentAccentColor);
  },

  toggleColorMode: function() {
    this.allowCycling = !this.allowCycling;
    if (this.allowCycling) {
      randomButton.removeClass("fa-eyedropper").addClass("fa-random");
    } else {
      randomButton.removeClass("fa-random").addClass("fa-eyedropper");
    }
  },

  updateAppColorTransition: function(transition) {
    var sectionTransition = transition + " all ease-in-out",
        borderTransition = transition + " border-color ease-in-out",
        colorTransition = transition + " color ease-in-out",
        strokeTransition = transition + " stroke ease-in-out";

    sectionA.css('transition', sectionTransition);
    sectionAContainer.css('transition', sectionTransition);
    sectionB.css('transition', sectionTransition);
    sectionC.css('transition', sectionTransition);
    actionButtons.css('transition', sectionTransition);
    footer.css('transition', sectionTransition);
    activityLogContainer.css('transition', sectionTransition);
    activityLogPanel.css('transition', borderTransition);
    contentTask.css({'transition': colorTransition});

    // SVG Elements
    $(".grid line, .grid path").css({'transition': strokeTransition});
    $(".line").css({'transition': strokeTransition});
  },

  resetAppColorTransition: function() {
    this.updateAppColorTransition(DEFAULT_TRANSITION_TIME_IN_SECS);
  },

  randomizeTheme: function() {
    var self = this;

    self.updateAppColorTransition("500ms");
    if (!self.allowCycling) {
      colorPicker.click();
    } else {
      self.cycleColor();
      setTimeout(function(){
        self.resetAppColorTransition();
      }, 500);
    }
  },

};

});