var planet = {
    names: ["Vega", "Cestus", "Draconis", "Tyr", "Pegasus", "Proxima", "Antares", "Canopus", "Andromeda", "Orion"],
    visible: [true, false, false, false, false, false, false, false, false, false],
    population: [25000000, 50000000, 150000000, 300000000, 450000000, 700000000, 950000000, 1300000000, 2000000000, 3000000000],
    fleet: [0, 250, 1500, 4500, 9000, 17500, 28500, 45500, 80000, 135000],
    growPopulation: function (lastPlanet) {
        "use strict";
        var i;
        for (i = 0; i <= lastPlanet; i += 1) {
            planet.population[i] += (Math.floor((Math.random() * 10000) + 5000));
        }
    },
    repairFleet: function (nextPlanet) {
        "use strict";
        var maxFleet = Math.floor(nextPlanet * planet.population[nextPlanet] / 200000);
        if(planet.fleet[nextPlanet] < maxFleet) {
            planet.fleet[nextPlanet] += nextPlanet;
        }
    }
};
var space = {
    backgroundTimerSize: 242,
    irridiumMineDelayReduction: 130,
    dilithiumMineDelayReduction: 150,
    tritaniumMineDelayReduction: 100,
    resourceResearchTime: 10000,
    irridium: 0,
    dilithium: 0,
    tritanium: 0,
    irridiumClickRate: 1,
    dilithiumClickRate: 1,
    tritaniumClickRate: 1,
    irridiumProduction: 0.05,
    dilithiumProduction: 0.025,
    tritaniumProduction: 0.1,
    irridiumProductionLevel: 1,
    dilithiumProductionLevel: 1,
    tritaniumProductionLevel: 1,
    irridiumProductionResearchCost: 200,
    dilithiumProductionResearchCost: 200,
    tritaniumProductionResearchCost: 200,
    irridiumProductionResearchTime: 30,
    dilithiumProductionResearchTime: 30,
    tritaniumProductionResearchTime: 30,
    irridiumProductionResearchActive: false,
    dilithiumProductionResearchActive: false,
    tritaniumProductionResearchActive: false,
    irridiumMineDelay: 3130,
    dilithiumMineDelay: 4150,
    tritaniumMineDelay: 2100,
    shipLevel: 0,
    maxShipLevel: 4,
    shipResearchActive: false,
    shipNames: ["Scout", "Cruiser", "Frigate", "Destroyer", "Battleship"],
    shipCount: 0,
    shipVisible: false,
    researchShipIrridiumCost: [100, 2000, 14000, 33000, 100000],
    researchShipDilithiumCost: [80, 1600, 6000, 13500, 40000],
    researchShipTritaniumCost: [200, 5000, 34700, 72000, 214000],
    buildShipIrridiumCost: [0, 100, 2000, 14000, 33000, 100000],
    buildShipDilithiumCost: [0, 80, 1600, 6000, 13500, 40000],
    buildShipTritaniumCost: [0, 200, 5000, 34700, 72000, 214000],
    shipResearchSpeed: [10000, 30000, 60000, 120000, 180000],
    batteryCount: 0,
    batteryVisible: false,
    batteryLevel: 1,
    batteryResearchActive: false,
    researchBatteryIrridiumCost: 300,
    researchBatteryDilithiumCost: 150,
    researchBatteryTritaniumCost: 500,
    buildBatteryIrridiumCost: 15,
    buildBatteryDilithiumCost: 8,
    buildBatteryTritaniumCost: 25,
    shieldCount: 0,
    shieldVisible: false,
    shieldLevel: 1,
    researchShieldIrridiumCost: 300,
    researchShieldDilithiumCost: 150,
    researchShieldTritaniumCost: 500,
    buildShieldIrridiumCost: 20,
    buildShieldDilithiumCost: 10,
    buildShieldTritaniumCost: 30,
    planetNumber: 0,
    totalPopulation: 25,
    pirateAttackChance: 1,
    pirateShipCount: 5,
    running: true,
    addMessage: function (message, reset = true) {
        "use strict";
        if(reset === true) {
            $(".recent").removeClass("recent");
        }
        $("#start").after("<p class=\"recent\">" + message + "</p>");
    },
    costCheck: function (irridiumCost, dilithiumCost, tritaniumCost, buttonId, numeric) {
        "use strict";
        var enableButtonClass = "button_input",
            disableButtonClass = "button_disabled";
        
        if (numeric === true) {
            enableButtonClass = "button_input_numeric";
            disableButtonClass = "button_disabled_numeric";
        }

        if (space.irridium >= irridiumCost && space.dilithium >= dilithiumCost && space.tritanium >= tritaniumCost) {
            $("#" + buttonId).removeClass(disableButtonClass);
            $("#" + buttonId).addClass(enableButtonClass);
        }
        else {
            $("#" + buttonId).addClass(disableButtonClass);
            $("#" + buttonId).removeClass(enableButtonClass);
        }
    },
    getSequenceSum: function (count) {
        "use strict";
        return ((count * (count + 1)) / 2);
    },
    generateResearchTime: function (count, time) {
        "use strict";
        return (space.getSequenceSum(count) * time);
    },
    reloadButton: function (buttonId, fullDelay, eventFunction, rate, endCallback) {
        "use strict";
        if (rate > 0) {
            $("#" + buttonId).css("background-position", -(space.backgroundTimerSize * (1 - (rate / fullDelay))) + "px 0px");
            space.globalWindow.setTimeout(function () {
                space.reloadButton(buttonId, fullDelay, eventFunction, rate - 50, endCallback);
            }, 50);
        }
        else {
            $("#" + buttonId).css("background-position", -(space.backgroundTimerSize * (1 - (rate / fullDelay))) + "px 0px");
            $("#" + buttonId).on("click", eventFunction);
            if (endCallback !== undefined && endCallback !== null) {
                endCallback();
            }
        }
        return true;
    },
    irridiumMiningButtonClick: function () {
        "use strict";
        var irridiumMineReload, mineRate;
        mineRate = space.getSequenceSum(space.irridiumProductionLevel) * space.irridiumClickRate;
        $("#irridiumMining").off("click");
        space.irridium += mineRate;
        space.addMessage("Mined " + mineRate + " irridium");
        space.updateDisplay();
        irridiumMineReload = (space.irridiumMineDelay - (space.irridiumMineDelayReduction * space.irridiumProductionLevel));
        space.globalWindow.setTimeout(function () {
            space.reloadButton("irridiumMining", irridiumMineReload, space.irridiumMiningButtonClick, irridiumMineReload, null);
        }, 50);
    },
    dilithiumMiningButtonClick: function () {
        "use strict";
        var dilithiumMineReload, mineRate;
        mineRate = space.getSequenceSum(space.dilithiumProductionLevel) * space.dilithiumClickRate;
        $("#dilithiumMining").off("click");
        space.dilithium += mineRate;
        space.addMessage("Mined " + mineRate + " dilithium");
        space.updateDisplay();
        dilithiumMineReload = (space.dilithiumMineDelay - (space.dilithiumMineDelayReduction * space.dilithiumProductionLevel));
        space.globalWindow.setTimeout(function () {
            space.reloadButton("dilithiumMining", dilithiumMineReload, space.dilithiumMiningButtonClick, dilithiumMineReload, null);
        }, 50);
    },
    tritaniumMiningButtonClick: function () {
        "use strict";
        var tritaniumMineReload, mineRate;
        mineRate = space.getSequenceSum(space.tritaniumProductionLevel) * space.tritaniumClickRate;
        $("#tritaniumMining").off("click");
        space.tritanium += mineRate;
        space.addMessage("Mined " + mineRate + " tritanium");
        space.updateDisplay();
        tritaniumMineReload = (space.tritaniumMineDelay - (space.tritaniumMineDelayReduction * space.tritaniumProductionLevel));
        space.globalWindow.setTimeout(function () {
            space.reloadButton("tritaniumMining", tritaniumMineReload, space.tritaniumMiningButtonClick, tritaniumMineReload, null);
        }, 50);
    },
    shipResearchButtonClick: function () {
        "use strict";
        space.shipResearchActive = true;
        $("#shipResearch").off("click");
        space.addMessage("Researching " + space.shipNames[space.shipLevel]);
        space.irridium -= space.researchShipIrridiumCost[space.shipLevel];
        space.dilithium -= space.researchShipDilithiumCost[space.shipLevel];
        space.tritanium -= space.researchShipTritaniumCost[space.shipLevel];
        space.updateDisplay();
        space.globalWindow.setTimeout(function () {
            space.reloadButton("shipResearch", space.shipResearchSpeed[space.shipLevel], space.shipResearchButtonClick, space.shipResearchSpeed[space.shipLevel], function () {
                space.addMessage("Researched " + space.shipNames[space.shipLevel] + " ship");
                space.shipLevel += 1;
                space.shipCount = space.globalWindow.parseInt((space.shipCount / 10).toFixed(0));
                space.shipResearchActive = false;
                space.updateButtons();
            });
        }, 50);
    },
    batteryResearchButtonClick: function () {
        "use strict";
        var researchTime = space.generateResearchTime(space.batteryLevel, space.resourceResearchTime);
        space.batteryResearchActive = true;
        $("#batteryResearch").off("click");
        space.addMessage("Bringing battery research to level " + (space.batteryLevel + 1));
        space.irridium -= space.researchBatteryIrridiumCost * space.batteryLevel;
        space.dilithium -= space.researchBatteryDilithiumCost * space.batteryLevel;
        space.tritanium -= space.researchBatteryTritaniumCost * space.batteryLevel;
        space.updateDisplay();
        space.globalWindow.setTimeout(function () {
            space.reloadButton("batteryResearch", researchTime, space.batteryResearchButtonClick, researchTime, function () {
                space.batteryLevel += 1;
                space.addMessage("Battery research now at level  " + space.batteryLevel);
                space.batteryCount = space.globalWindow.parseInt((space.batteryCount / 2).toFixed(0));
                space.batteryResearchActive = false;
                space.updateButtons();
            });
        }, 50);
    },
    shieldResearchButtonClick: function () {
        "use strict";
        var researchTime = space.generateResearchTime(space.shieldLevel, space.resourceResearchTime);
        space.shieldResearchActive = true;
        $("#shieldResearch").off("click");
        space.addMessage("Bringing shield research to level " + (space.shieldLevel + 1));
        space.irridium -= space.researchBatteryIrridiumCost * space.shieldLevel;
        space.dilithium -= space.researchBatteryDilithiumCost * space.shieldLevel;
        space.tritanium -= space.researchBatteryTritaniumCost * space.shieldLevel;
        space.updateDisplay();
        space.globalWindow.setTimeout(function () {
            space.reloadButton("shieldResearch", researchTime, space.shieldResearchButtonClick, researchTime, function () {
                space.shieldLevel += 1;
                space.addMessage("Battery research now at level  " + space.shieldLevel);
                space.shieldCount = space.globalWindow.parseInt((space.shieldCount / 2).toFixed(0));
                space.shieldResearchActive = false;
                space.updateButtons();
            });
        }, 50);
    },
    buildShipButtonClick: function (amount) {
        "use strict";
        $("#buildShip").off("click");
        $("#buildShip10").off("click");
        $("#buildShip50").off("click");
        //check amounts again in case lag allows button to be clicked before it is disabled.
        if (space.irridium >= (space.buildShipIrridiumCost[space.shipLevel] * amount) &&
                space.dilithium >= (space.buildShipDilithiumCost[space.shipLevel] * amount) &&
                space.tritanium >= (space.buildShipTritaniumCost[space.shipLevel] * amount)) {
            space.irridium -= (space.buildShipIrridiumCost[space.shipLevel] * amount);
            space.dilithium -= (space.buildShipDilithiumCost[space.shipLevel] * amount);
            space.tritanium -= (space.buildShipTritaniumCost[space.shipLevel] * amount);
            space.updateButtons();
            space.shipCount += amount;
            space.addMessage("Built " + amount + " " + space.shipNames[space.shipLevel - 1] + "s");
        }
        space.updateDisplay();
        $("#buildShip").on("click", function () {
            space.buildShipButtonClick(1);
        });
        $("#buildShip10").on("click", function () {
            space.buildShipButtonClick(10);
        });
        $("#buildShip50").on("click", function () {
            space.buildShipButtonClick(50);
        });
    },
    buildBatteryButtonClick: function (amount) {
        "use strict";
        $("#buildBattery").off("click");
        $("#buildBattery10").off("click");
        $("#buildBattery50").off("click");
        //check amounts again in case lag allows button to be clicked before it is disabled.
        if (space.irridium >= (space.buildBatteryIrridiumCost * space.batteryLevel * amount) &&
                space.dilithium >= (space.buildBatteryDilithiumCost * space.batteryLevel * amount)&&
                space.tritanium >= (space.buildBatteryTritaniumCost * space.batteryLevel * amount)) {
            space.irridium -= (space.buildBatteryIrridiumCost * space.batteryLevel * amount);
            space.dilithium -= (space.buildBatteryDilithiumCost * space.batteryLevel * amount);
            space.tritanium -= (space.buildBatteryTritaniumCost * space.batteryLevel * amount);
            space.updateButtons();
            space.batteryCount += amount;
            space.addMessage("Built " + amount + ((amount === 1) ? " battery" : " batteries"));
        }
        space.updateDisplay();
        $("#buildBattery").on("click", function () {
            space.buildBatteryButtonClick(1);
        });
        $("#buildBattery10").on("click", function () {
            space.buildBatteryButtonClick(10);
        });
        $("#buildBattery50").on("click", function () {
            space.buildBatteryButtonClick(50);
        });
    },
    buildShieldButtonClick: function (amount) {
        "use strict";
        $("#buildShield").off("click");
        $("#buildShield10").off("click");
        $("#buildShield50").off("click");
        //check amounts again in case lag allows button to be clicked before it is disabled.
        if (space.irridium >= (space.buildShieldIrridiumCost * space.shieldLevel * amount) &&
                space.dilithium >= (space.buildShieldDilithiumCost * space.shieldLevel * amount)&&
                space.tritanium >= (space.buildShieldTritaniumCost * space.shieldLevel * amount)) {
            space.irridium -= (space.buildShieldIrridiumCost * space.shieldLevel * amount);
            space.dilithium -= (space.buildShieldDilithiumCost * space.shieldLevel * amount);
            space.tritanium -= (space.buildShieldTritaniumCost * space.shieldLevel * amount);
            space.updateButtons();
            space.shieldCount += amount;
            space.addMessage("Built " + amount + ((amount === 1) ? " shield" : " shields"));
        }
        space.updateDisplay();
        $("#buildShield").on("click", function () {
            space.buildShieldButtonClick(1);
        });
        $("#buildShield10").on("click", function () {
            space.buildShieldButtonClick(10);
        });
        $("#buildShield50").on("click", function () {
            space.buildShieldButtonClick(50);
        });
    },
    irridiumResearchButtonClick: function () {
        "use strict";
        $("#irridiumResearch").off("click");
        space.irridiumProductionResearchActive = true;
        space.irridium -= space.irridiumProductionResearchCost * space.irridiumProductionLevel;
        space.addMessage("Bringing irridium research to level " + (space.irridiumProductionLevel + 1));
        space.updateDisplay();
        space.globalWindow.setTimeout(function () {
            space.reloadButton("irridiumResearch", space.irridiumProductionLevel * space.resourceResearchTime, space.irridiumResearchButtonClick, space.irridiumProductionLevel * space.resourceResearchTime, function () {
                space.irridiumProductionResearchActive = false;
                space.irridiumProductionLevel += 1;
                space.updateButtons();
                space.addMessage("Irridium research now at level " + space.irridiumProductionLevel);
            });
        }, 50);
    },
    dilithiumResearchButtonClick: function () {
        "use strict";
        $("#dilithiumResearch").off("click");
        space.dilithiumProductionResearchActive = true;
        space.dilithium -= space.dilithiumProductionResearchCost * space.dilithiumProductionLevel;
        space.addMessage("Bringing dilithium research to level " + (space.dilithiumProductionLevel + 1));
        space.updateDisplay();
        space.globalWindow.setTimeout(function () {
            space.reloadButton("dilithiumResearch", space.dilithiumProductionLevel * space.resourceResearchTime, space.dilithiumResearchButtonClick, space.dilithiumProductionLevel * space.resourceResearchTime, function () {
                space.dilithiumProductionResearchActive = false;
                space.dilithiumProductionLevel += 1;
                space.updateButtons();
                space.addMessage("Dilithium research now at level " + space.dilithiumProductionLevel);
            });
        }, 50);
    },
    tritaniumResearchButtonClick: function () {
        "use strict";
        $("#tritaniumResearch").off("click");
        space.tritaniumProductionResearchActive = true;
        space.tritanium -= space.tritaniumProductionResearchCost * space.tritaniumProductionLevel;
        space.addMessage("Bringing tritanium research to level " + (space.tritaniumProductionLevel + 1));
        space.updateDisplay();
        space.globalWindow.setTimeout(function () {
            space.reloadButton("tritaniumResearch", space.tritaniumProductionLevel * space.resourceResearchTime, space.tritaniumResearchButtonClick, space.tritaniumProductionLevel * space.resourceResearchTime, function () {
                space.tritaniumProductionResearchActive = false;
                space.tritaniumProductionLevel += 1;
                space.updateButtons();
                space.addMessage("Tritanium research now at level " + space.tritaniumProductionLevel);
            });
        }, 50);
    },
    attackPlanetButtonClick: function () {
        "use strict";
        var playerDamage, planetDamage, damageModifier;
        $("#attackPlanet").off("click");
        space.addMessage("Attacking " + planet.names[space.planetNumber + 1] + " with " + space.shipCount + " " + 
            space.shipNames[space.shipLevel - 1] + "s");
        space.addMessage(planet.names[space.planetNumber + 1] + " defends with " + 
            planet.fleet[space.planetNumber + 1] + " ships", false);
        damageModifier = 5 * ((space.shipLevel + 1) - ((space.planetNumber + 2) / 4));
        planetDamage = Math.floor((Math.random() * (46 - damageModifier)) + 5) / 100;
        playerDamage = 1 - planetDamage;
        planetDamage = Math.floor(planetDamage * planet.fleet[space.planetNumber + 1]);
        playerDamage = Math.floor((playerDamage * space.shipCount) + 0.5);
        if(playerDamage > planet.fleet[space.planetNumber + 1]) {
            playerDamage = planet.fleet[space.planetNumber + 1];
        }
        if(planetDamage > space.shipCount) {
            planetDamage = space.shipCount;
        }
        planet.fleet[space.planetNumber + 1] -= playerDamage;
        space.shipCount -= planetDamage;
        space.addMessage("You lost " + planetDamage + " " + space.shipNames[space.shipLevel - 1] + "s", false);
        space.addMessage(planet.names[space.planetNumber + 1] + " lost " + playerDamage + " ships", false);
        if(planet.fleet[space.planetNumber + 1] === 0) {
            space.addMessage("You conquered " + planet.names[space.planetNumber + 1], false);
            space.planetNumber += 1;
        }
        else {
            space.addMessage("Conquest of " + planet.names[space.planetNumber + 1] + " unsuccessful", false);
        }
        $("#attackPlanet").html("Attack " + planet.names[space.planetNumber + 1]);
        $("#attackPlanet").on("click", space.attackPlanetButtonClick);
    },
    updateButtons: function () {
        "use strict";
        if (space.irridium >= space.researchShipIrridiumCost[space.shipLevel] &&
                space.dilithium >= space.researchShipDilithiumCost[space.shipLevel] &&
                space.tritanium >= space.researchShipTritaniumCost[space.shipLevel] &&
                space.shipLevel <= space.maxShipLevel) {
            $("#shipResearch").removeClass("button_hidden");
        }
        if (!space.shipResearchActive) {
            if (space.shipLevel > space.maxShipLevel) {
                $("#shipResearch").addClass("button_hidden");
            }
            else {
                space.costCheck(space.researchShipIrridiumCost[space.shipLevel], 
                    space.researchShipDilithiumCost[space.shipLevel],
                    space.researchShipTritaniumCost[space.shipLevel], "shipResearch", false);
            }
        }
        if (space.shipLevel > 0) {
            $("#buildShip").removeClass("button_hidden");
            $("#buildShip10").removeClass("button_hidden_numeric");
            $("#buildShip50").removeClass("button_hidden_numeric");
            space.costCheck(space.buildShipIrridiumCost[space.shipLevel], 
                space.buildShipDilithiumCost[space.shipLevel],
                space.buildShipTritaniumCost[space.shipLevel], "buildShip", false);
            space.costCheck(space.buildShipIrridiumCost[space.shipLevel] * 10, 
                space.buildShipDilithiumCost[space.shipLevel] * 10,
                space.buildShipTritaniumCost[space.shipLevel] * 10, "buildShip10", true);
            space.costCheck(space.buildShipIrridiumCost[space.shipLevel] * 50, 
                space.buildShipDilithiumCost[space.shipLevel] * 50,
                space.buildShipTritaniumCost[space.shipLevel] * 50, "buildShip50", true);
        }
        if(space.shipCount > 0) {
            $("#attackPlanet").addClass("button_input");
            $("#attackPlanet").removeClass("button_disabled");
            $("#attackPlanet").attr("title", "Attack " + planet.names[space.planetNumber + 1] + 
                " with " + space.shipCount + " " + 
            space.shipNames[space.shipLevel - 1] + "s");
        }
        else {
            $("#attackPlanet").removeClass("button_input");
            $("#attackPlanet").addClass("button_disabled");
            $("#attackPlanet").attr("title", "Build " + space.shipNames[space.shipLevel - 1] + "s to attack");
        }

        if (space.irridium >= space.researchBatteryIrridiumCost &&
                space.dilithium >= space.researchBatteryDilithiumCost &&
                space.tritanium >= space.researchBatteryTritaniumCost) {
            $("#batteryResearch").removeClass("button_hidden");
        }
        if (space.irridium >= space.buildBatteryIrridiumCost &&
                space.dilithium >= space.buildBatteryDilithiumCost &&
                space.tritanium >= space.buildBatteryTritaniumCost) {
            $("#buildBattery").removeClass("button_hidden");
            $("#buildBattery10").removeClass("button_hidden_numeric");
            $("#buildBattery50").removeClass("button_hidden_numeric");
        }
        
        if (space.batteryResearchActive === false) {
            space.costCheck(space.researchBatteryIrridiumCost * space.batteryLevel, 
                space.researchBatteryDilithiumCost * space.batteryLevel,
                space.researchBatteryTritaniumCost * space.batteryLevel, "batteryResearch", false);
        }
        space.costCheck(space.buildBatteryIrridiumCost * space.batteryLevel, 
            space.buildBatteryDilithiumCost * space.batteryLevel,
            space.buildBatteryTritaniumCost * space.batteryLevel, "buildBattery", false);
        space.costCheck(space.buildBatteryIrridiumCost * space.batteryLevel * 10, 
            space.buildBatteryDilithiumCost * space.batteryLevel * 10,
            space.buildBatteryTritaniumCost * space.batteryLevel * 10, "buildBattery10", true);
        space.costCheck(space.buildBatteryIrridiumCost * space.batteryLevel * 50, 
            space.buildBatteryDilithiumCost * space.batteryLevel * 50,
            space.buildBatteryTritaniumCost * space.batteryLevel * 50, "buildBattery50", true);

        if (space.irridium >= space.researchShieldIrridiumCost &&
                space.dilithium >= space.researchShieldDilithiumCost &&
                space.tritanium >= space.researchShieldTritaniumCost) {
            $("#shieldResearch").removeClass("button_hidden");
        }
        if (space.irridium >= space.buildShieldIrridiumCost &&
                space.dilithium >= space.buildShieldDilithiumCost &&
                space.tritanium >= space.buildShieldTritaniumCost) {
            $("#buildShield").removeClass("button_hidden");
            $("#buildShield10").removeClass("button_hidden_numeric");
            $("#buildShield50").removeClass("button_hidden_numeric");
        }
        space.costCheck(space.researchShieldIrridiumCost * space.shieldLevel, 
            space.researchShieldDilithiumCost * space.shieldLevel,
            space.researchShieldTritaniumCost * space.shieldLevel, "shieldResearch", false);
        space.costCheck(space.buildShieldIrridiumCost * space.shieldLevel, 
            space.buildShieldDilithiumCost * space.shieldLevel,
            space.buildShieldTritaniumCost * space.shieldLevel, "buildShield", false);
        space.costCheck(space.buildShieldIrridiumCost * space.shieldLevel * 10, 
            space.buildShieldDilithiumCost * space.shieldLevel * 10,
            space.buildShieldTritaniumCost * space.shieldLevel * 10, "buildShield10", true);
        space.costCheck(space.buildShieldIrridiumCost * space.shieldLevel * 50, 
            space.buildShieldDilithiumCost * space.shieldLevel * 50,
            space.buildShieldTritaniumCost * space.shieldLevel * 50, "buildShield50", true);

        if (space.irridium >= space.irridiumProductionResearchCost) {
            $("#irridiumResearch").removeClass("button_hidden");
        }
        if (space.irridiumProductionResearchActive !== true) {
            space.costCheck(space.irridiumProductionResearchCost * space.irridiumProductionLevel, 0, 0, "irridiumResearch", false);
        }
        if (space.dilithium >= space.dilithiumProductionResearchCost) {
            $("#dilithiumResearch").removeClass("button_hidden");
        }
        if (space.dilithiumProductionResearchActive !== true) {
            space.costCheck(0, space.dilithiumProductionResearchCost * space.dilithiumProductionLevel, 0, "dilithiumResearch", false);
        }
        if (space.tritanium >= space.tritaniumProductionResearchCost) {
            $("#tritaniumResearch").removeClass("button_hidden");
        }
        if (space.tritaniumProductionResearchActive !== true) {
            space.costCheck(0, 0, space.tritaniumProductionResearchCost * space.tritaniumProductionLevel, "tritaniumResearch", false);
        }
        if (space.shipLevel <= space.maxShipLevel) {
            $("#shipResearch").html("Research " + space.shipNames[space.shipLevel]);
            $("#shipResearch").attr("title", 
                space.researchShipIrridiumCost[space.shipLevel] + " irridium " +
                space.researchShipDilithiumCost[space.shipLevel] + " dilithium " +
                space.researchShipTritaniumCost[space.shipLevel] + " tritanium");
        }
        if (space.shipLevel > 0) {
            $("#buildShip").html("Build " + space.shipNames[space.shipLevel - 1]);
            $("#buildShip").attr("title", 
                space.buildShipIrridiumCost[space.shipLevel] + " irridium " +
                space.buildShipDilithiumCost[space.shipLevel] + " dilithium " +
                space.buildShipTritaniumCost[space.shipLevel] + " tritanium");
            $("#buildShip10").attr("title", "Build 10 " + space.shipNames[space.shipLevel - 1] + "s " +
                (space.buildShipIrridiumCost[space.shipLevel] * 10) + " irridium " +
                (space.buildShipDilithiumCost[space.shipLevel] * 10) + " dilithium " +
                (space.buildShipTritaniumCost[space.shipLevel] * 10) + " tritanium");
            $("#buildShip50").attr("title", "Build 50 " + space.shipNames[space.shipLevel - 1] + "s " +
                (space.buildShipIrridiumCost[space.shipLevel] * 50) + " irridium " +
                (space.buildShipDilithiumCost[space.shipLevel] * 50) + " dilithium " +
                (space.buildShipTritaniumCost[space.shipLevel] * 50) + " tritanium");
        }
        $("#irridiumResearch").attr("title", "Improved irridium mining rate for " + 
            (space.irridiumProductionResearchCost * space.irridiumProductionLevel) + " irridium");
        $("#dilithiumResearch").attr("title", "Improved dilithium mining rate for " + 
            (space.dilithiumProductionResearchCost * space.dilithiumProductionLevel) + " dilithium");
        $("#tritaniumResearch").attr("title", "Improved tritanium mining rate for " + 
            (space.tritaniumProductionResearchCost * space.tritaniumProductionLevel) + " tritanium");
        $("#buildBattery").attr("title", 
            (space.buildBatteryIrridiumCost * space.batteryLevel) + " irridium " +
            (space.buildBatteryDilithiumCost * space.batteryLevel) + " dilithium " +
            (space.buildBatteryTritaniumCost * space.batteryLevel) + " tritanium");
        $("#buildBattery10").attr("title", 
            (space.buildBatteryIrridiumCost * space.batteryLevel * 10) + " irridium " +
            (space.buildBatteryDilithiumCost * space.batteryLevel * 10) + " dilithium " +
            (space.buildBatteryTritaniumCost * space.batteryLevel * 10) + " tritanium");
        $("#buildBattery50").attr("title", 
            (space.buildBatteryIrridiumCost * space.batteryLevel * 50) + " irridium " +
            (space.buildBatteryDilithiumCost * space.batteryLevel * 50) + " dilithium " +
            (space.buildBatteryTritaniumCost * space.batteryLevel * 50) + " tritanium");
        $("#batteryResearch").attr("title", 
            (space.researchBatteryIrridiumCost * space.batteryLevel) + " irridium " +
            (space.researchBatteryDilithiumCost * space.batteryLevel) + " dilithium " +
            (space.researchBatteryTritaniumCost * space.batteryLevel) + " tritanium");
        $("#buildShield").attr("title", 
            (space.buildShieldIrridiumCost * space.shieldLevel) + " irridium " +
            (space.buildShieldDilithiumCost * space.shieldLevel) + " dilithium " +
            (space.buildShieldTritaniumCost * space.shieldLevel) + " tritanium");
        $("#buildShield10").attr("title", 
            (space.buildShieldIrridiumCost * space.shieldLevel * 10) + " irridium " +
            (space.buildShieldDilithiumCost * space.shieldLevel * 10) + " dilithium " +
            (space.buildShieldTritaniumCost * space.shieldLevel * 10) + " tritanium");
        $("#buildShield50").attr("title", 
            (space.buildShieldIrridiumCost * space.shieldLevel * 50) + " irridium " +
            (space.buildShieldDilithiumCost * space.shieldLevel * 50) + " dilithium " +
            (space.buildShieldTritaniumCost * space.shieldLevel * 50) + " tritanium");
        $("#shieldResearch").attr("title", 
            (space.researchShieldIrridiumCost * space.shieldLevel) + " irridium " +
            (space.researchShieldDilithiumCost * space.shieldLevel) + " dilithium " +
            (space.researchShieldTritaniumCost * space.shieldLevel) + " tritanium");
    },
    updateDisplay: function () {
        "use strict";
        var planetList = "",
            i, population;
        
        if(space.batteryVisible === false && space.batteryCount > 0) {
            $("#battery").removeClass("hidden_resources");
            space.batteryVisible = true;
        }
        if(space.shieldVisible === false && space.shieldCount > 0) {
            $("#shield").removeClass("hidden_resources");
            space.shieldVisible = true;
        }
        if(space.shipVisible === false && space.shipCount > 0) {
            $("#ships").removeClass("hidden_resources");
            $("#attackPlanet").removeClass("button_hidden");
            $("#attackPlanet").addClass("button_input");
            space.shipVisible = true;
        }
        $("#irridium").html("irridium: " + space.irridium.toFixed(0));
        $("#dilithium").html("dilithium: " + space.dilithium.toFixed(0));
        $("#tritanium").html("tritanium: " + space.tritanium.toFixed(0));
        $("#battery").html("Ground batteries: " + space.batteryCount);
        $("#shield").html("Planetary shield: " + space.shieldCount);
        $("#ships").html(space.shipNames[space.shipLevel - 1] + "s: " + space.shipCount);
        space.totalPopulation = 0;
        for (i = 0; i <= space.planetNumber; i += 1) {
            space.totalPopulation += planet.population[i];
            if (planet.population[i] < 1000000000) {
                population = (planet.population[i] / 1000000).toFixed(0) + "M";
            }
            else {
                population = (space.globalWindow.parseInt((planet.population[i] / 1000000).toFixed(0)) / 1000) + "B";
            }
            if(planet.visible[i] === false) {
                $("#" + planet.names[i]).removeClass("hidden_resources");
                planet.visible[i] = true;
            }
            $("#" + planet.names[i]).html(planet.names[i] + ": " + population);
        }
        if (space.totalPopulation < 1000000000) {
            population = (space.totalPopulation / 1000000).toFixed(0) + "M";
        }
        else {
            population = (space.globalWindow.parseInt((space.totalPopulation / 1000000).toFixed(0)) / 1000) + "B";
        }
        $("#population").html("Total Population: " + population);
        
    },
    pirateAttack: function () {
        "use strict";
        var attackingShipCount, tempShipCount, irridiumTake, dilithiumTake, tritaniumTake;
        if(space.pirateAttackChance > 1000 && Math.floor(Math.random() * 10000) <= space.pirateAttackChance) {
            space.pirateAttackChance = 0;
            attackingShipCount = Math.floor(Math.random() * 10) + space.pirateShipCount;
            space.addMessage(attackingShipCount + " pirate ships attack");
            if(space.shipCount > 0) {
                $("#ships").addClass("lost_resources");
            }
            if(attackingShipCount > space.shipCount) {
                attackingShipCount -= (space.shipCount * space.shipLevel);
                space.shipCount = 0;
            }
            else {
                space.shipCount -= (attackingShipCount / space.shipLevel);
                attackingShipCount = 0;
            }
            if(attackingShipCount > 0 && space.batteryCount > 0) {
                $("#battery").addClass("lost_resources");
                tempShipCount = attackingShipCount;
                attackingShipCount -= (space.batteryCount * space.batteryLevel);
                if(attackingShipCount > 0) {
                    space.batteryCount = Math.floor((space.batteryCount / space.batteryLevel) / 2);
                }
                else {
                    space.batteryCount -= Math.floor((tempShipCount / space.batteryLevel) / 4);
                }
            }
            if(attackingShipCount > 0 && space.shieldCount > 0) {
                $("#shield").addClass("lost_resources");
                tempShipCount = attackingShipCount;
                attackingShipCount -= (space.shieldCount * space.shieldLevel);
                if(attackingShipCount > 0) {
                    space.shieldCount = 0;
                }
                else {
                    space.shieldCount -= (tempShipCount / space.shieldLevel);
                }
            }
            if(attackingShipCount > 0) {
                irridiumTake = 0;
                dilithiumTake = 0;
                tritaniumTake = 0;
                while(irridiumTake < 18 || dilithiumTake < 18 || tritaniumTake < 18) {
                    irridiumTake = Math.floor(Math.random() * 60);
                    tritaniumTake = Math.floor(Math.random() * 40);
                    dilithiumTake = 100 - (irridiumTake + tritaniumTake);
                }
                irridiumTake = Math.floor((irridiumTake / 100) * attackingShipCount);
                tritaniumTake = Math.floor((tritaniumTake / 100) * attackingShipCount);
                dilithiumTake = attackingShipCount - (irridiumTake + tritaniumTake);
                if(irridiumTake > space.irridium) {
                    tritaniumTake += (irridiumTake - space.irridium);
                    irridiumTake = space.irridium;
                    space.irridium = 0;
                }
                else {
                    space.irridium -= irridiumTake;
                }
                if(tritaniumTake > space.tritanium) {
                    dilithiumTake += (tritaniumTake - space.tritanium);
                    tritaniumTake = space.tritanium;
                    space.tritanium = 0;
                }
                else {
                    space.tritanium -= tritaniumTake;
                }
                if(dilithiumTake > space.dilithium) {
                    dilithiumTake = space.dilithium;
                    space.dilithium = 0;
                }
                else {
                    space.dilithium -= dilithiumTake;
                }
                $("#irridium").addClass("lost_resources");
                $("#dilithium").addClass("lost_resources");
                $("#tritanium").addClass("lost_resources");
                space.addMessage("Pirates take " + irridiumTake + " irridium " + dilithiumTake + " dilithium " +
                    tritaniumTake + " tritanium", false);
                setTimeout(function () {
                    $(".lost_resources").removeClass("lost_resources");
                }, 4000);
            }
            else {
                space.addMessage("You fought off the pirates", false);
            }
            space.pirateShipCount += 1;
        }
        else {
            space.pirateAttackChance += (space.planetNumber + 1);
        }
    },
    generateResources: function () {
        "use strict";
        var populationModifier = space.totalPopulation / 25000000;
        space.irridium += (space.irridiumProduction * space.irridiumProductionLevel * populationModifier);
        space.dilithium += (space.dilithiumProduction * space.dilithiumProductionLevel * populationModifier);
        space.tritanium += (space.tritaniumProduction * space.tritaniumProductionLevel * populationModifier);
    },
    update: function () {
        "use strict";
        planet.repairFleet(space.planetNumber + 1);
        space.generateResources();
        space.pirateAttack();
        space.updateDisplay();
        space.updateButtons();
        planet.growPopulation(space.planetNumber);
        if (space.running === true) {
            space.globalWindow.setTimeout(space.update, 1000);
        }
    },
    setEvents: function () {
        "use strict";
        $("#irridiumMining").on("click", space.irridiumMiningButtonClick);
        $("#dilithiumMining").on("click", space.dilithiumMiningButtonClick);
        $("#tritaniumMining").on("click", space.tritaniumMiningButtonClick);
        $("#shipResearch").on("click", space.shipResearchButtonClick);
        $("#batteryResearch").on("click", space.batteryResearchButtonClick);
        $("#shieldResearch").on("click", space.shieldResearchButtonClick);
        $("#buildShip").on("click", function () {
            space.buildShipButtonClick(1);
        });
        $("#buildShip10").on("click", function () {
            space.buildShipButtonClick(10);
        });
        $("#buildShip50").on("click", function () {
            space.buildShipButtonClick(50);
        });
        $("#buildBattery").on("click", function () {
            space.buildBatteryButtonClick(1);
        });
        $("#buildBattery10").on("click", function () {
            space.buildBatteryButtonClick(10);
        });
        $("#buildBattery50").on("click", function () {
            space.buildBatteryButtonClick(50);
        });
        $("#buildShield").on("click", function () {
            space.buildShieldButtonClick(1);
        });
        $("#buildShield10").on("click", function () {
            space.buildShieldButtonClick(10);
        });
        $("#buildShield50").on("click", function () {
            space.buildShieldButtonClick(50);
        });
        $("#irridiumResearch").on("click", space.irridiumResearchButtonClick);
        $("#dilithiumResearch").on("click", space.dilithiumResearchButtonClick);
        $("#tritaniumResearch").on("click", space.tritaniumResearchButtonClick);
        $("#attackPlanet").on("click", space.attackPlanetButtonClick);
    },
    setSizes: function () {
        "use strict";
        var width = $(space.globalWindow).width() - 2,
            height = $(space.globalWindow).height()- 2,
            narrow,wide;
        narrow = space.globalWindow.parseInt(((width - 40) * 0.3).toFixed(0));
        wide = width - (narrow * 2);
        $("#input").css("width", narrow + "px");
        $("#input").css("left", "0px");
        $("#input").css("height", height + "px");
        $("#data").css("width", narrow + "px");
        $("#data").css("left", narrow + "px");
        $("#data").css("height", height + "px");
        $("#display").css("width", wide + "px");
        $("#display").css("left", (narrow + narrow) + "px");
        $("#display").css("height", height + "px");
    },
    init: function () {
        "use strict";
        space.setSizes();
        $(space.globalWindow).resize(function () {
            space.setSizes();
        });
        space.setEvents();
        space.update();
        space.globalWindow.setTimeout(space.update, 1000);
    },
    cheat: function() {
        space.irridium += 10000;
        space.dilithium += 10000;
        space.tritanium += 10000;
    }
};

function load() {
    var i, nameValue, name, value,
        cookies = document.cookie.split(";");
    
    for(i = 0;i < cookies.length; i += 1) {
        nameValue = cookies[i].trim().split("=");
        name = nameValue[0];
        value = nameValue[1];
        if(name.indexOf("space") !== -1) {
            assignValue(space, name.substring(6), value);
        }
        else if(name.indexOf("planet") !== -1) {
            assignValue(planet, name.substring(7), value);
        }
    }
}

function assignValue(object, key, value) {
    var index = key.indexOf("."),
        realValue;
    
    if(index > -1) {
        assignValue(object[key.substring(0, index)], key.substring(index + 1), value);
    }
    else {
        if(value.indexOf("true") > -1 || value.indexOf("true") > -1) {
            realValue = ("true" === value);
        }
        else {
            realValue = new Number(value);
        }
        object[key] = realValue;
    }
}

function save() {
    var expire = "expires=Thu, 31 Dec 2015 12:00:00 GMT";
    
    saveKeys(space, function (object, key) {
        document.cookie = "space." + key + "=" + object[key] + "; " + expire;
    });
    saveKeys(planet.visible, function (object, key) {
        document.cookie = "planet.visible." + key + "=" + object[key] + "; " + expire;
    });
    saveKeys(planet.fleet, function (object, key) {
        document.cookie = "planet.fleet." + key + "=" + object[key] + "; " + expire;
    });
    saveKeys(planet.population, function (object, key) {
        document.cookie = "planet.population." + key + "=" + object[key] + "; " + expire;
    });
    
    space.globalWindow.setTimeout(save, 5000);
}

function saveKeys(object, callback) {
    for(key in object) {
        if(object.hasOwnProperty(key)) {
            if(typeof object[key] !== "function" && typeof object[key] !== "object" && key !== "globalWindow") {
                callback(object, key);
            }
        }
    }
}

$(document).ready(function () {
    "use strict";
    load();
    space.globalWindow = (0, eval)("this");
    space.init();
    space.globalWindow.setTimeout(save, 5000);
});
