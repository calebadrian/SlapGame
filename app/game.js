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
    this.hits = 0
    this.items = items
    this.attacks = attacks
    this.currentMod = 1
    this.img = imgUrl
    this.dead = ""
}

var items = {
    armor: new Item("Armor", .2, "This is Armor!"),
    shield: new Item("Shield", .3, "Oh no they picked up a shield!"),
    potion: new Item("Potion", 25, "A potion to restore their health!")
}

var weapons = {
    axe: new Weapon("Axe", 25, "A blunt axe that does a small amount of damage", true, 5),
    sword: new Weapon("Sword", 50, "A nice sharpened sword that does a fair amount of damage", false, 3),
    switchWeapon: new Weapon("Switch Weapon", 0, "Lose a turn and switch weapons", true, -1)
}

var attacks = {
    scratch: new Attack("Scratch", 5, "Scratches you with claws"),
    bite: new Attack("Bite", 10, "Nom nom nom")
}

var enemies = [new Enemy("Great Jagras", 100, [items.armor, items.shield, items.potion], [attacks.scratch, attacks.bite], "https://vignette.wikia.nocookie.net/monsterhunter/images/f/f5/MHW-Great_Jagras_Render_001.png/revision/latest?cb=20171012121738"),
                new Enemy("Kulu-Ya-Ku", 120, [items.armor, items.shield, items.potion], [attacks.scratch, attacks.bite], "https://vignette.wikia.nocookie.net/monsterhunter/images/7/7c/MHW-Kulu-Ya-Ku_Render_001.png/revision/latest?cb=20171204124443"),
                new Enemy("Pukei-Pukei", 140, [items.armor, items.shield, items.potion], [attacks.bite, attacks.scratch], "https://vignette.wikia.nocookie.net/monsterhunter/images/e/e3/MHW-Pukei-Pukei_Render_001.png/revision/latest?cb=20171011151724"),
                new Enemy("Tobi-Kadachi", 160, [items.armor, items.shield, items.potion], [attacks.bite, attacks.scratch], "https://vignette.wikia.nocookie.net/monsterhunter/images/a/a1/MHW-Tobi-Kadachi_Render_001.png/revision/latest?cb=20171011093207"),
                new Enemy("Anjanath", 180, [items.armor, items.shield, items.potion], [attacks.bite, attacks.scratch], "https://vignette.wikia.nocookie.net/monsterhunter/images/9/9d/MHW-Anjanath_Render_001.png/revision/latest?cb=20171012123741"),
                new Enemy("Game Over", 200, [], [], "http://www.pngpix.com/wp-content/uploads/2016/10/PNGPIX-COM-Trophy-Cup-PNG-Transparent-Image.png")]

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

var contentContainer = document.getElementById("content-container")


function damage(weaponChoice){
    var playerImg = document.getElementById("player-img")
    playerImg.classList.add("shake")
    if (weaponChoice == 'Switch Weapon' && player.weapons[2].enabled == true){
        if (player.equipped == "Axe"){
            if (player.weapons[1].uses >= player.weapons[1].uselimit){
                player.weapons[1].enabled = false
            } else {
                player.weapons[1].enabled = true
            }
            player.equipped = "Sword"
            player.weapons[0].enabled = false
            if (enemies[player.defeated].dead != ""){
                enemies[player.defeated].dead = ""
            }
            checkHealth()
            enemyAttack()
            checkHealth()
            draw(false)
            return
        } else {
            if (player.weapons[0].uses >= player.weapons[0].uselimit){
                player.weapons[0].enabled = false
            } else {
                player.weapons[0].enabled = true
            }
            player.equipped = "Axe"
            player.weapons[1].enabled = false
            if (enemies[player.defeated].dead != ""){
                enemies[player.defeated].dead = ""
            }
            checkHealth()
            enemyAttack()
            checkHealth()
            draw(false)
            return
        }
        checkHealth()
        enemyAttack()
        checkHealth()
        draw(false)
        return
    }
    for (let i = 0; i < player.weapons.length; i++) {
        const weapon = player.weapons[i]
        if (weaponChoice == weapon.name && weapon.enabled == true){
            weapon.uses ++
            if (weapon.uses == weapon.uselimit){
                weapon.enabled = false
            }
            var damageCalc = Math.floor(Math.random() * weapon.damage) * enemies[player.defeated].currentMod
            enemies[player.defeated].health -= damageCalc
            if (damageCalc == 0){

            } else {
                enemies[player.defeated].hits ++
            }
            if (enemies[player.defeated].dead != ""){
                enemies[player.defeated].dead = ""
            }
            if (checkHealth() == "You Win!"){
                return
            }
            enemyAttack()
            checkHealth()
            draw(false)
            return
        }
    }
}

function sharpen(){
    if (player.health <= 0 || player.dead == "You Win!"){
        return
    }
    if (player.equipped == player.weapons[0].name){
        player.weapons[0].uses = 0
        player.weapons[0].enabled = true
        if (enemies[player.defeated].dead != ""){
            enemies[player.defeated].dead = ""
        }
        enemyAttack()
        checkHealth()
        draw(false)
        return
    } else {
        player.weapons[1].uses = 0
        player.weapons[1].enabled = true
        if (enemies[player.defeated].dead != ""){
            enemies[player.defeated].dead = ""
        }
        enemyAttack()
        checkHealth()
        draw(false)
        return
    }
}

function enemyAttack(){
    var attack = enemies[player.defeated].attacks[Math.floor(Math.random() * (enemies[player.defeated].attacks.length))]
    player.health -= Math.floor(Math.random() * attack.damage)
    player.hits++
}

function addMods(itemChoice){
    var mod = 0
    if (itemChoice == 'Potion' && enemies[player.defeated].items[2].enabled != true){
        enemies[player.defeated].health += enemies[player.defeated].items[2].modifier
        if (enemies[player.defeated].dead != ""){
            enemies[player.defeated].dead = ""
        }
        draw(false)
        enemies[player.defeated].items[2].enabled = true
        return
    }
    for (let i = 0; i < enemies[player.defeated].items.length; i++) {
        const item = enemies[player.defeated].items[i];
        if (item.name == itemChoice && item.enabled != true){
            mod -= item.modifier
            item.enabled = true
            if (enemies[player.defeated].dead != ""){
                enemies[player.defeated].dead = ""
            }
        }
    }
    enemies[player.defeated].currentMod += mod
    draw(false)
}

function draw(firstdraw){
    if (firstdraw == false){
        var playerImg = document.getElementById("player-img")
        playerImg.classList.add("shake")
    }
    var equippedWeapon = player.equipped
    if (player.weapons[0].name == equippedWeapon){
        var usesRemaining = player.weapons[0].uselimit - player.weapons[0].uses
    } else {
        var usesRemaining = player.weapons[1].uselimit - player.weapons[1].uses
    }
    let template = `
    <div class="row title-format">
        <div class="col-sm-6 m-b-1 p-t-1">
            <h4>Name: ${player.name}</h4>
            <h4>Health: ${player.health}</h4>
            <h4>Hits: ${player.hits}</h4>
        </div>
        <div class="col-sm-6 m-b-1 p-t-1">
            <h4>Name: ${enemies[player.defeated].name}</h4>
            <h4>Health: ${enemies[player.defeated].health}</h4>
            <h4>Hits: ${enemies[player.defeated].hits}</h4>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6 col-sm-12 col-format">
            <img src="https://vignette.wikia.nocookie.net/monsterhunter/images/1/17/Sword_and_shield%2C_monster_hunter_tri.png/revision/latest?cb=20100605202331" alt="" class="resize shake" id="player-img">
                <div class="row">`

    for (let i = 0; i < player.weapons.length; i++) {
        const weapon = player.weapons[i];
            template +=`
                <div class="col-md-3 col-sm-12 m-b-1">
                    <button class="btn-primary weapon-btn-format" onclick="damage('${weapon.name}')">${weapon.name}</button>
                </div>
                    `
    }
    template += `
                <div class="col-md-3 col-sm-12 m-b-1">
                    <button class="btn-danger weapon-btn-format" onclick="sharpen()">Sharpen</button>
                </div>
                <div class="col-sm-12">
                    <h4>Currently Equipped Weapon: ${player.equipped}</h4>
                    <h4>Current Weapon Uses: ${usesRemaining}</h4>
                    <h1>${player.dead}</h1>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-sm-12 col-format">
        <img src="${enemies[player.defeated].img}" alt="" class="resize">
            <div class="row">
    `
    for (let i = 0; i < enemies[player.defeated].items.length; i++) {
        const item = enemies[player.defeated].items[i];
        template +=`
            <div class="col-md-3 col-sm-12 m-b-1">
                <button class="btn-primary weapon-btn-format" onclick="addMods('${enemies[player.defeated].items[i].name}')">${enemies[player.defeated].items[i].name}</button>
            </div>`
    }
    template += `
                <div class="col-md-3 col-sm-12 m-b-1">
                    <button class="btn-danger weapon-btn-format" onclick="reset()">Reset</button>
                </div>
                <div class="col-sm-12">
                    <h1>${enemies[player.defeated].dead}</h1>
                </div>
            </div>
        </div>`
    contentContainer.innerHTML = template
    if (firstdraw == true){
        var playerImg = document.getElementById("player-img")
        playerImg.classList.remove("shake")
    }
}

function checkHealth(){
    if (enemies[player.defeated].health <= 0 && player.health > 0){
        player.defeated ++
        enemies[player.defeated].dead = enemies[player.defeated - 1].name + " Defeated!"
        if (enemies[player.defeated].name == "Game Over"){
            for (let i = 0; i < player.weapons.length; i++) {
                const weapon = player.weapons[i];
                weapon.enabled = false            
            }
            for (let i = 0; i < enemies[player.defeated].items.length; i++) {
                const item = enemies[player.defeated].items[i];
                item.enabled = true
            }
            player.dead = "You Win!"
            draw(false)
            return player.dead
        }
    } else if (player.health <= 0){
        player.dead = "You Died!"
        for (let i = 0; i < player.weapons.length; i++) {
            const weapon = player.weapons[i];
            weapon.enabled = false            
        }
        for (let i = 0; i < enemies[player.defeated].items.length; i++) {
            const item = enemies[player.defeated].items[i];
            item.enabled = true
        }
        draw(false)
    }
}

function reset(){
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        enemy.health = 100 + (20*i)
        enemy.hits = 0
        enemy.currentMod = 1
    }
    player.health = 100
    player.hits = 0
    player.currentMod = 0
    player.defeated = 0
    player.dead = ""
    player.equipped = "Axe"
    for (let i = 0; i < player.weapons.length; i++) {
        const weapon = player.weapons[i];
        if (i == 1){
            weapon.enabled = false
        } else {
            weapon.enabled = true
        }
        weapon.uses = 0
    }
    for (let i = 0; i < enemies[player.defeated].items.length; i++) {
        const item = enemies[player.defeated].items[i];
        item.enabled = false
    }
    draw(true)
}

draw(true)