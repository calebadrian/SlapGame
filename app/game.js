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

var contentContainer = document.getElementById("content-container")


function damage(weaponChoice){
    var playerImg = document.getElementById("player-img")
    playerImg.classList.add("shake")
    if (enemies[player.defeated].dead != ""){
        enemies[player.defeated].dead = ""
    }
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
            draw(false, false)
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
            draw(false, false)
            return
        }
        checkHealth()
        enemyAttack()
        checkHealth()
        draw(false, false)
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
                enemies[player.defeated].dead = enemies[player.defeated].name + " dodged your attack!"
            } else {
                enemies[player.defeated].hits ++
            }
            if (checkHealth() == "You Win!"){
                return
            }
            enemyAttack()
            checkHealth()
            draw(false, false)
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
        draw(false, false)
        return
    } else {
        player.weapons[1].uses = 0
        player.weapons[1].enabled = true
        if (enemies[player.defeated].dead != ""){
            enemies[player.defeated].dead = ""
        }
        enemyAttack()
        checkHealth()
        draw(false, false)
        return
    }
}

function enemyAttack(){
    if (player.dead != ""){
        player.dead = ""
    }
    var attack = enemies[player.defeated].attacks[Math.floor(Math.random() * (enemies[player.defeated].attacks.length))]
    var damageDealt = Math.floor(Math.random() * attack.damage)
    player.health -= damageDealt
    if (damageDealt == 0){
        player.dead = "You dodged " + enemies[player.defeated].name + "'s attack!"
        return
    }
    player.hits ++
}

function addMods(itemChoice){
    var mod = 0
    if (itemChoice == 'Sleep' && enemies[player.defeated].items[2].enabled != true){
        enemies[player.defeated].health += enemies[player.defeated].items[2].modifier
        if (enemies[player.defeated].dead != ""){
            enemies[player.defeated].dead = ""
        }
        enemies[player.defeated].items[2].enabled = true
        draw(true, false)
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
    draw(true, false)
}

function draw(firstdraw, pageopening){
    if (pageopening == true){
        var playerName = prompt("Please enter your name!")
        player.name = playerName
    }
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
        <div class="col-sm-12 p-t-1">
            <h1>Welcome to the Ancient Forest!</h1>
        </div>
        <div class="col-sm-6 p-t-1">
            <h4>Name: ${player.name}</h4>
            <h4>Health: ${player.health}</h4>
            <h4>Hits: ${player.hits}</h4>
        </div>
        <div class="col-sm-6 p-t-1">
            <h4>Name: ${enemies[player.defeated].name}</h4>
            <h4>Health: ${enemies[player.defeated].health}</h4>
            <h4>Hits: ${enemies[player.defeated].hits}</h4>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6 col-sm-12 col-format">
            <img src="https://calebadrian.github.io/SlapGame/assets/photos/player.png" alt="" class="resize shake" id="player-img">
                <div class="progress m-b-1">
                    <div class="progress-bar progress-bar-striped progress-bar-animated bg-danger" role="progressbar" style="width: ${player.health}%" aria-valuenow="${player.health}" aria-valuemin="0" aria-valuemax="100">${player.health} hp</div>
                </div>
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
                    <h4>${player.dead}</h4>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-sm-12 col-format">
        <img src="${enemies[player.defeated].img}" alt="" class="resize">
        <div class="progress m-b-1">
            <div class="progress-bar bg-danger progress-bar-striped progress-bar-animated" role="progressbar" style="width: ${enemies[player.defeated].health}%" aria-valuenow="${enemies[player.defeated].health}" aria-valuemin="0" aria-valuemax="${enemies[player.defeated].health}">${enemies[player.defeated].health} hp</div>
        </div>
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
                    <h4>${enemies[player.defeated].dead}</h4>
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
            draw(false, false)
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
        draw(false, false)
    }
}

function reset(){
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        if (i == (enemies.length - 1)){
            enemy.health = 0
        } else {
            enemy.health = 100 + (20*i)
        }
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
    draw(true, false)
}

draw(true, true)