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
        sword: new Weapon("Sword", 90, "A nice sharpened sword that does a fair amount of damage", false, 3),
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
        weapons: [weapons.axe, weapons.sword, weapons.switchWeapon],
        currentMod: 1,
        defeated: 0,
        dead: "",
        equipped: "Axe"
    }

    //public

    this.setPlayerName = function setPlayerName(name){
        player.name = name
    }

    this.decPlayerHealth = function decPlayerHealth(damageDone){
        player.health -= damageDone
    }

    this.incPlayerHits = function incPlayerHits(){
        player.hits ++
    }

    this.incPlayerWeaponUses = function incPlayerWeaponUses(index){
        player.weapons[index].uses ++ 
    }

    this.getPlayerWeaponProp = function getPlayerWeaponProp(index, prop){
        return player.weapons[index][prop]
    }

    this.setPlayerWeaponProp = function setPlayerWeaponProp(index, prop, val){
        player.weapons[index][prop] = val
    }

    this.getPlayerEquippedUses = function getPlayerEquippedUses(){
        for (let i = 0; i < player.weapons.length; i++) {
            const weapon = player.weapons[i];
            if (weapon.name == player.equipped){
                return weapon.uses
            }
        }
    }

    this.getPlayerEquippedUseLimit = function getPlayerEquippedUseLimit(){
        for (let i = 0; i < player.weapons.length; i++) {
            const weapon = player.weapons[i];
            if (weapon.name == player.equipped){
                return weapon.uselimit
            }
        }
    }

    this.setPlayerEquipped = function setPlayerEquipped(toEquip){
        player.equipped = toEquip
    }

    this.setPlayerDead = function setPlayerDead(dead){
        player.dead = dead
    }

    this.incPlayerDefeated = function incPlayerDefeated(){
        player.defeated ++
    }

    this.getEnemiesPercentageHealth = function getEnemiesPercentageHealth(){
        return  (enemies[player.defeated].health/enemies[player.defeated].maxHealth) * 100
    }

    this.setEnemiesHealth = function setEnemiesHealth(damageDone){
        enemies[player.defeated].health -= damageDone
    }

    this.incEnemiesHealth = function incEnemiesHealth(val){
        enemies[player.defeated].health += val
    }

    this.incEnemiesHits = function incEnemiesHits(){
        enemies[player.defeated].hits ++
    }

    this.setEnemiesItemsProp = function setEnemiesItemsProp(index, prop, val){
        enemies[player.defeated].items[index][prop] = val
    }

    this.setEnemiesDead = function setEnemiesDead(dead){
        enemies[player.defeated].dead = dead
    }

    this.setEnemiesDeadDefeated = function setEnemiesDeadDefeated(){
        enemies[player.defeated].dead = enemies[player.defeated - 1].name + " Defeated!"
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
        enemies[index][prop] = val
    }

    this.getPlayer = function getPlayer(){
        return JSON.parse(JSON.stringify(player))
    }

    this.playerReset = function playerReset(){
        player.health = 100
        player.hits = 0
        player.currentMod = 0
        player.defeated = 0
        player.dead = ""
        player.equipped = "Axe"
    }



}