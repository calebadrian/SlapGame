function SlapService(){

    //private

    function Item(name, modifier, description){
        this.name = name
        this.modifier = modifier
        this.description = description
        this.enabled = false
    }
    
    function Weapon(name, damage, description, enabled, uselimit){
        this.name = name
        this.damage = damage
        this.description = description
        this.enabled = enabled
        this.uses = 0
        this.uselimit = uselimit
    }
    
    function Attack(name, damage, description){
        this.name = name
        this.damage = damage
        this.description = description
    }
    
    function Enemy(name, health, items, attacks, imgUrl){
        this.name = name
        this.health = health
        this.maxHealth = health
        this.hits = 0
        this.items = items
        this.attacks = attacks
        this.currentMod = 1
        this.currentMods = []
        this.img = imgUrl
        this.dead = ""
    }
    
    var items = {
        protectHome: new Item("Protect Home", .2, "Monster protects their home!"),
        younglings: new Item("Call young ones", .3, "They brought the kids!"),
        sleep: new Item("Sleep", 25, "Sleep to restore their health!")
    }
    
    var weapons = {
        axe: new Weapon("Axe", 60, "A blunt axe that does a small amount of damage", true, 7),
        sword: new Weapon("Sword", 90, "A nice sharpened sword that does a fair amount of damage", true, 3),
        switchWeapon: new Weapon("Switch Weapon", 0, "Lose a turn and switch weapons", true, -1)
    }
    
    var attacks = {
        scratch: new Attack("Scratch", 5, "Scratches you with claws"),
        bite: new Attack("Bite", 10, "Nom nom nom")
    }
    
    var enemies = [new Enemy("Great Jagras", 100, [items.protectHome, items.younglings, items.sleep], [attacks.scratch, attacks.bite], "https://calebadrian.github.io/SlapGame/assets/photos/great-jagras.png"),
                    new Enemy("Kulu-Ya-Ku", 120, [items.protectHome, items.younglings, items.sleep], [attacks.scratch, attacks.bite], "https://calebadrian.github.io/SlapGame/assets/photos/kulu-ya-ku.png"),
                    new Enemy("Pukei-Pukei", 140, [items.protectHome, items.younglings, items.sleep], [attacks.bite, attacks.scratch], "https://calebadrian.github.io/SlapGame/assets/photos/pukei-pukei.png"),
                    new Enemy("Tobi-Kadachi", 160, [items.protectHome, items.younglings, items.sleep], [attacks.bite, attacks.scratch], "https://calebadrian.github.io/SlapGame/assets/photos/tobi-kadachi.png"),
                    new Enemy("Anjanath", 180, [items.protectHome, items.younglings, items.sleep], [attacks.bite, attacks.scratch], "https://calebadrian.github.io/SlapGame/assets/photos/anjanath.png"),
                    new Enemy("Game Over", 0, [], [], "https://calebadrian.github.io/SlapGame/assets/photos/trophy.png")]
    
    var player = {
        health: 100,
        name: "Hunter",
        hits: 0,
        weapons: {
            axe: weapons.axe,
            sword: weapons.sword,
            switchWeapon: weapons.switchWeapon
        },
        currentMod: 1,
        defeated: 0,
        dead: "",
        equipped: weapons.axe
    }

    //public

    this.incPlayerWeaponUses = function incPlayerWeaponUses(index){
        player.weapons[index].uses ++ 
    }

    this.getPlayerWeaponProp = function getPlayerWeaponProp(index, prop){
        return player.weapons[index][prop]
    }

    this.setPlayerWeaponProp = function setPlayerWeaponProp(index, prop, val){
        player.weapons[index][prop] = val
    }

    this.incEnemiesHits = function incEnemiesHits(){
        enemies[player.defeated].hits ++
    }

    this.setEnemiesItemsProp = function setEnemiesItemsProp(index, prop, val){
        enemies[player.defeated].items[index][prop] = val
    }

    this.incEnemiesMod = function incEnemiesMod(mod){
        enemies[player.defeated].currentMod += mod
    }

    this.setEnemiesCurrentMods = function setEnemiesCurrentMods(toAdd){
        if(enemies[player.defeated].currentMods.length == 0){
            for (let i = 0; i < enemies[player.defeated].items.length; i++) {
                const item = enemies[player.defeated].items[i];
                if (item.name == toAdd && item.enabled == false){
                    enemies[player.defeated].currentMods.push(item)
                    return
                }
            }
        }
        for (let i = 0; i < enemies[player.defeated].currentMods.length; i++) {
            const item = enemies[player.defeated].currentMods[i];
            if (item.name == toAdd && item.enabled == false){
                return false
            }
        }
        for (let i = 0; i < enemies[player.defeated].items.length; i++) {
            const item = enemies[player.defeated].items[i];
            if (item.name == toAdd && item.enabled == false){
                enemies[player.defeated].currentMods.push(item)
                return
            }
        }
    }

    this.getModToAdd = function getModToAdd(mod){
        for (let i = 0; i < enemies[player.defeated].currentMods.length; i++){
            const item = enemies[player.defeated].currentMods[i]
            if (item.name == mod){
                return enemies[player.defeated].currentMods[i].modifier
            }
        }
    }

    this.incEnemiesCurrentMod = function incEnemiesCurrentMod(mod){
        if (mod > 1){
            enemies[player.defeated].health += mod
            return
        }
        enemies[player.defeated].currentMod += mod
    }

    this.getEnemiesCurrentMods = function getEnemiesCurrentMods(){
        var template = ''
        for (let i = 0; i < enemies[player.defeated].currentMods.length; i++) {
            const mod = enemies[player.defeated].currentMods[i];
            template += mod.name + ", "
        }
        return template
    }

    this.getEnemiesLength = function getEnemiesLength(){
        return enemies.length
    }

    this.getEnemiesAtIndex = function getEnemiesAtIndex(index){
        return JSON.parse(JSON.stringify(enemies[index]))
    }

    this.setEnemiesPropAtIndex = function setEnemiesPropAtIndex(index, prop, val){
        if(prop == 'health'){
            if (val >= 100){
                enemies[index][prop] = val
                return
            }
            enemies[index][prop] += val
            return
        }
        enemies[index][prop] = val
    }

    this.getPlayer = function getPlayer(){
        return JSON.parse(JSON.stringify(player))
    }

    this.setPlayerProp  = function setPlayerProp(prop, val){
        if (prop == 'health'){
            player[prop] -= val
            return
        }
        if (prop == 'hits' || prop == 'defeated'){
            player[prop] += val
            return
        }
        player[prop] = val
    }

    this.setPlayerEquippedProp = function setPlayerEquippedProp(prop, val){
        if (val == 0){
            player.equipped[prop] = val
            return
        }
        player.equipped[prop] += val
    }

    this.getPlayerEquippedProp = function getPlayerEquippedProp(prop){
        return player.equipped[prop]
    }

    this.playerReset = function playerReset(){
        player.health = 100
        player.hits = 0
        player.currentMod = 0
        player.defeated = 0
        player.dead = ""
        player.equipped = weapons.axe
    }



}