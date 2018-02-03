function Item(name, modifier, description, enabled){
    this.name = name
    this.modifier = modifier
    this.description = description
    this.enabled = enabled
}

function Weapon(name, damage, description, enabled, uses, uselimit){
    this.name = name
    this.damage = damage
    this.description = description
    this.enabled = enabled
    this.uses = uses
    this.uselimit = uselimit
}

function Attack(name, damage, description){
    this.name = name
    this.damage = damage
    this.description = description
}

function Enemy(name, health, hits, items, attacks, currentMod, imgUrl){
    this.name = name
    this.health = health
    this.hits = hits
    this.items = items
    this.attacks = attacks
    this.currentMod = currentMod
    this.img = imgUrl
}

var items = {
    armor: new Item("Armor", .2, "This is Armor!", false),
    shield: new Item("Shield", .3, "Oh no they picked up a shield!", false),
    potion: new Item("Potion", 25, "A potion to restore their health!", false)
}

var weapons = {
    axe: new Weapon("Axe", 20, "A blunt axe that does a small amount of damage", true, 0, 5),
    sword: new Weapon("Sword", 50, "A nice sharpened sword that does a fair amount of damage", false, 0, 3),
    switchWeapon: new Weapon("Switch Weapon", 0, "Lose a turn and switch weapons", true, 0, -1)
}

var attacks = {
    scratch: new Attack("Scratch", 5, "Scratches you with claws"),
    bite: new Attack("Bite", 10, "Nom nom nom")
}

var enemies = [new Enemy("Great Jagras", 100, 0, [items.armor, items.shield, items.potion], [attacks.scratch, attacks.bite], 1, "http://placehold.it/200x200"),
                new Enemy("Anjanath", 120, 0, [items.armor, items.shield, items.potion], [attacks.scratch, attacks.bite], 1, "http://placehold.it/200x200")]

var player = {
    health: 100,
    name: "Hunter",
    hits: 0,
    weapons: [weapons.axe, weapons.sword, weapons.switchWeapon],
    currentMod: 1,
    defeated: 0
}

//enemy display variables
var enemyNameDisplay = document.getElementById("enemy-name-display")
var enemyHealthDisplay = document.getElementById("enemy-health-display")
var enemyHitsDisplay = document.getElementById("enemy-hits-display")
var enemyImgDisplay = document.getElementById("enemy-img-display")

//player display variables
var playerNameDisplay = document.getElementById("player-name-display")
var playerHealthDisplay = document.getElementById("player-health-display")
var playerHitsDisplay = document.getElementById("player-hits-display")

//container display variables
var itemsContainer = document.getElementById("items-container")
var weaponsContainer = document.getElementById("weapons-container")
var knockoutDisplay = document.getElementById("knockout-display")

function damage(weaponChoice){
    if (weaponChoice == 'Switch Weapon'){
        for (let i = 0; i < player.weapons.length; i++) {
            const weapon = player.weapons[i];
            if (weapon.uses == weapon.uselimit){
                weapon.enabled == false
                weapon.uses = 0
                if (i == 1){
                    player.weapons[0].enabled = true
                    enemyAttack()
                    checkHealth()
                    return
                } else {
                    player.weapons[1].enabled = true
                    enemyAttack()
                    checkHealth()
                    return
                }
            }
        }
    }
    for (let i = 0; i < player.weapons.length; i++) {
        const weapon = player.weapons[i]
        if (weaponChoice == weapon.name && weapon.enabled == true){
            weapon.uses ++
            if (weapon.uses == weapon.uselimit){
                weapon.enabled = false
            }
            console.log(weapon.damage)
            var damageCalc = Math.floor(Math.random() * weapon.damage) * enemies[player.defeated].currentMod
            console.log(damageCalc)
            enemies[player.defeated].health -= damageCalc
            if (damageCalc == 0){

            } else {
                enemies[player.defeated].hits ++
            }
            drawEnemyHealth()
            drawEnemyHits()
            checkHealth()
            enemyAttack()
            checkHealth()
            return
        }
    }
}

function enemyAttack(){
    var attack = enemies[player.defeated].attacks[Math.floor(Math.random() * (enemies[player.defeated].attacks.length))]
    player.health -= attack.damage
    player.hits++
    drawPlayerHealth()
    drawPlayerHits()
}

function addMods(itemChoice){
    var mod = 0
    if (itemChoice == 'Potion' && enemies[player.defeated].items[2].enabled != true){
        enemies[player.defeated].health += enemies[player.defeated].items[2].modifier
        drawEnemyHealth()
        enemies[player.defeated].items[2].enabled = true
        return
    }
    for (let i = 0; i < enemies[player.defeated].items.length; i++) {
        const item = enemies[player.defeated].items[i];
        if (item.name == itemChoice && item.enabled != true){
            mod -= item.modifier
            item.enabled = true
        }
    }
    enemies[player.defeated].currentMod += mod
}

function drawEnemyName(){
    const template = `${enemies[player.defeated].name}`
    enemyNameDisplay.innerHTML = template
}

function drawPlayerName(){
    const template = `${player.name}`
    playerNameDisplay.innerHTML = template
}

function drawEnemyHealth(){
    const template = `${enemies[player.defeated].health}`
    enemyHealthDisplay.innerHTML = template
}

function drawPlayerHealth(){
    const template = `${player.health}`
    playerHealthDisplay.innerHTML = template
}

function drawEnemyHits(){
    const template = `${enemies[player.defeated].hits}`
    enemyHitsDisplay.innerHTML = template
}

function drawPlayerHits(){
    const template = `${player.hits}`
    playerHitsDisplay.innerHTML = template
}

function drawEnemyImg(){
    const template = `<img src="${enemies[player.defeated].img}" alt="" class="resize">`
    enemyImgDisplay.innerHTML = template
}

function drawItemButtons(){
    let template = ''
    for (let i = 0; i < enemies[player.defeated].items.length; i++) {
        const item = enemies[player.defeated].items[i];
        template += `
        <button class="btn-primary" onclick="addMods('${enemies[player.defeated].items[i].name}')">${enemies[player.defeated].items[i].name}</button>`
    }
    itemsContainer.innerHTML = template
}

function drawWeaponButtons(){
    let template = ''
    for (let i = 0; i < player.weapons.length; i++){
        const weapon = player.weapons[i];
        template += `
        <div class="col-md-4 col-sm-6">
            <button class="btn-primary" onclick="damage('${weapon.name}')">${weapon.name}</button>
        </div>`
    }
    weaponsContainer.innerHTML = template
}

function drawKnockout(){
    let template = `<h1>You Died!</h1>`
    knockoutDisplay.innerHTML = template
}

function drawEmptyKnockout(){
    let template = ``
    knockoutDisplay.innerHTML = template
}

function checkHealth(){
    if (enemies[player.defeated].health <= 0 && player.health >= 0){
        player.defeated ++
        drawEnemyHealth()
        drawEnemyHits()
        drawEnemyName()
        drawEnemyImg()
    } else if (player.health <= 0){
        for (let i = 0; i < player.weapons.length; i++) {
            const weapon = player.weapons[i];
            weapon.enabled = false            
        }
        for (let i = 0; i < enemies[player.defeated].items.length; i++) {
            const item = enemies[player.defeated].items[i];
            item.enabled = true
        }
        drawKnockout()
    }
}

function reset(){
    player.defeated = 0
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
    drawEnemyHealth()
    drawEnemyHits()
    drawEnemyName()
    drawEnemyImg()
    drawPlayerHealth()
    drawPlayerHits()
    drawEmptyKnockout()
}


drawEnemyName()
drawEnemyHealth()
drawEnemyHits()
drawEnemyImg()
drawPlayerName()
drawPlayerHealth()
drawPlayerHits()
drawItemButtons()
drawWeaponButtons()