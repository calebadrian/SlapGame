function slapController() {

    //PRIVATE FUNCTIONS AND VARIABLES

    var slapService = new SlapService()

    var contentContainer = document.getElementById("content-container")

    /**
     * This function is to draw to the page at the container specified
     * @param {*} firstdraw 
     * @param {*} pageopening 
     */
    function draw(firstdraw, pageopening) {
        if (pageopening == true) {
            var playerName = prompt("Please enter your name!")
            slapService.setPlayerName(playerName)
        }
        if (firstdraw == false) {
            var playerImg = document.getElementById("player-img")
            playerImg.classList.add("shake")
        }
        let template = `
        <div class="row title-format">
            <div class="col-sm-12 p-t-1">
                <h1>Welcome to the Ancient Forest!</h1>
            </div>
            <div class="col-sm-6 p-t-1">
                <h4>Name: ${slapService.getPlayerName()}</h4>
                <h4>Health: ${slapService.getPlayerHealth()}</h4>
                <h4>Hits: ${slapService.getPlayerHits()}</h4>
            </div>
            <div class="col-sm-6 p-t-1">
                <h4>Name: ${slapService.getEnemiesName()}</h4>
                <h4>Health: ${slapService.getEnemiesHealth()}</h4>
                <h4>Hits: ${slapService.getEnemiesHits()}</h4>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6 col-sm-12 col-format">
                <img src="https://calebadrian.github.io/SlapGame/assets/photos/player.png" alt="" class="resize shake" id="player-img">
                    <div class="progress m-b-1">
                        <div class="progress-bar progress-bar-striped progress-bar-animated bg-danger" role="progressbar" style="width: ${slapService.getPlayerHealth()}%" aria-valuenow="${slapService.getPlayerHealth()}" aria-valuemin="0" aria-valuemax="100">${slapService.getPlayerHealth()} hp</div>
                    </div>
                    <div class="row">`
        for (let i = 0; i < slapService.getPlayerWeaponLength(); i++) {
            const weapon = slapService.getPlayerWeaponAtIndex(i);
            template += `
                    <div class="col-md-3 col-sm-12 m-b-1">
                        <button class="btn-primary weapon-btn-format" onclick="app.controllers.slapController.damage('${weapon.name}')">${weapon.name}</button>
                    </div>
                        `
        }
        template += `
                    <div class="col-md-3 col-sm-12 m-b-1">
                        <button class="btn-danger weapon-btn-format" onclick="app.controllers.slapController.sharpen()">Sharpen</button>
                    </div>
                    <div class="col-sm-12">
                        <h4>Currently Equipped Weapon: ${slapService.getPlayerEquipped()}</h4>
                        <h4>Current Weapon Uses: ${slapService.getPlayerEquippedUseLimit() - slapService.getPlayerEquippedUses()}</h4>
                        <h4>${slapService.getPlayerDead()}</h4>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-sm-12 col-format">
            <img src="${slapService.getEnemiesImg()}" alt="" class="resize">
            <div class="progress m-b-1">
                <div class="progress-bar bg-danger progress-bar-striped progress-bar-animated" role="progressbar" style="width: ${slapService.getEnemiesPercentageHealth()}%" aria-valuenow="${slapService.getEnemiesHealth()}" aria-valuemin="0" aria-valuemax="${slapService.getEnemiesMaxHealth()}">${slapService.getEnemiesHealth()} hp</div>
            </div>
                <div class="row">
        `

        for (let i = 0; i < slapService.getEnemiesItemsLength(); i++) {
            const item = slapService.getEnemiesItemsAtIndex(i);
            template += `
                <div class="col-md-3 col-sm-12 m-b-1">
                    <button class="btn-primary weapon-btn-format" onclick="app.controllers.slapController.addMods('${item.name}')">${item.name}</button>
                </div>`
        }
        template += `
                    <div class="col-md-3 col-sm-12 m-b-1">
                        <button class="btn-danger weapon-btn-format" onclick="app.controllers.slapController.reset()">Reset</button>
                    </div>
                    <div class="col-sm-12">
                        <h4>Current Mods: ${slapService.getEnemiesCurrentMods()}</h4>
                        <h4>${slapService.getEnemiesDead()}</h4>
                    </div>
                </div>
            </div>`
        contentContainer.innerHTML = template
        if (firstdraw == true) {
            var playerImg = document.getElementById("player-img")
            playerImg.classList.remove("shake")
        }
    }

    /**
     * This function automates the enemies attack
     */
    function enemyAttack() {
        if (slapService.getPlayerDead != "") {
            slapService.setPlayerDead("")
        }
        var attack = slapService.getEnemiesAttackAtIndex((Math.floor(Math.random())) * (slapService.getEnemiesAttackLength()))
        var damageDealt = Math.floor(Math.random() * attack.damage)
        slapService.decPlayerHealth(damageDealt)
        if (damageDealt == 0) {
            slapService.setPlayerDead("You dodged " + slapService.getEnemiesName() + "'s attack!")
            return
        }
        slapService.incPlayerHits()
    }

    function checkHealth(){
        if (slapService.getEnemiesHealth() <= 0 && slapService.getPlayerHealth() > 0){
            slapService.incPlayerDefeated()
            slapService.setEnemiesDeadDefeated()
            if (slapService.getEnemiesName() == "Game Over"){
                for (let i = 0; i < slapService.getPlayerWeaponLength(); i++) {
                    const weapon = slapService.getPlayerWeaponAtIndex(i);
                    weapon.enabled = false            
                }
                for (let i = 0; i < slapService.getEnemiesItemsLength(); i++) {
                    const item = slapService.getEnemiesItemsAtIndex(i);
                    item.enabled = true
                }
                slapService.setPlayerDead("You Win!")
                draw(false, false)
                return slapService.getPlayerDead()
            }
        } else if (slapService.getPlayerHealth() <= 0){
            slapService.setPlayerDead("You Died!")
            for (let i = 0; i < slapService.getPlayerWeaponLength(); i++) {
                const weapon = slapService.getPlayerWeaponAtIndex(i);
                weapon.enabled = false            
            }
            for (let i = 0; i < slapService.getEnemiesItemsLength(); i++) {
                const item = slapService.getEnemiesItemsAtIndex(i);
                item.enabled = true
            }
            draw(false, false)
        }
    }

    // PUBLIC FUNCTIONS AND VARIABLES
    /**
     * This function is done on click of a weapon button by a user
     * @param {*} weaponChoice 
     */
    this.damage = function damage(weaponChoice) {
        var playerImg = document.getElementById("player-img")
        playerImg.classList.add("shake")
        if (slapService.getEnemiesDead() != "") {
            slapService.setEnemiesDead("")
        }
        if (weaponChoice == 'Switch Weapon' && slapService.getPlayerWeaponProp(2, 'enabled') == true) {
            if (slapService.getPlayerEquipped() == "Axe") {
                if (slapService.getPlayerWeaponProp(1, 'uses') >= slapService.getPlayerWeaponProp(1, 'uselimit')) {
                    slapService.setPlayerWeaponProp(1, 'enabled', false)
                } else {
                    slapService.setPlayerWeaponProp(1, 'enabled', true)
                }
                slapService.setPlayerEquipped("Sword")
                slapService.setPlayerWeaponProp(0, 'enabled', false)
                if (slapService.getEnemiesDead() != "") {
                    slapService.setEnemiesDead("")
                }
                checkHealth()
                enemyAttack()
                checkHealth()
                draw(false, false)
                return
            } else {
                if (slapService.getPlayerWeaponProp(0, 'uses') >= slapService.getPlayerWeaponProp(0, 'uselimit')) {
                    slapService.setPlayerWeaponProp(0, 'enabled', false)
                } else {
                    slapService.setPlayerWeaponProp(0, 'enabled', true)
                }
                slapService.setPlayerEquipped("Axe")
                slapService.setPlayerWeaponProp(1, 'enabled', false)
                if (slapService.getEnemiesDead() != "") {
                    slapService.setEnemiesDead("")
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
        for (let i = 0; i < slapService.getPlayerWeaponLength(); i++) {
            const weapon = slapService.getPlayerWeaponAtIndex(i)
            if (weaponChoice == weapon.name && weapon.enabled == true) {
                weapon.uses++
                if (weapon.uses == weapon.uselimit) {
                    weapon.enabled = false
                }
                var damageCalc = Math.floor(Math.random() * weapon.damage) * slapService.getEnemiesMod()
                slapService.setEnemiesHealth(damageCalc)
                if (damageCalc == 0) {
                    slapService.setEnemiesDead(slapService.getEnemiesName() + " dodged your attack")
                } else {
                    slapService.incEnemiesHits()
                }
                if (checkHealth() == "You Win!") {
                    return
                }
                enemyAttack()
                checkHealth()
                draw(false, false)
                return
            }
        }
    }

    /**
     * This function resets the amount of uses a weapon has on click by user
     */
    this.sharpen = function sharpen() {
        if (slapService.getPlayerHealth() <= 0 || slapService.getPlayerDead() == "You Win!") {
            return
        }
        if (slapService.getPlayerEquipped() == slapService.getPlayerWeaponProp(0, 'name')) {
            slapService.setPlayerWeaponProp(0, 'uses', 0)
            slapService.setPlayerWeaponProp(0, 'enabled', true)
            if (slapService.getEnemiesDead() != "") {
                slapService.setEnemiesDead("")
            }
            enemyAttack()
            checkHealth()
            draw(false, false)
            return
        } else {
            slapService.setPlayerWeaponProp(1, 'uses', 0)
            slapService.setPlayerWeaponProp(1, 'enabled', true)
            if (slapService.getEnemiesDead() != "") {
                slapService.setEnemiesDead("")
            }
            enemyAttack()
            checkHealth()
            draw(false, false)
            return
        }
    }

    /**
     * This function adds the mods to the enemy on click by user
     * @param {*} itemChoice 
     */
    this.addMods = function addMods(itemChoice){
        if (slapService.setEnemiesCurrentMods(itemChoice) == false){
            return
        }
        var mod = slapService.getModToAdd(itemChoice)
        slapService.incEnemiesCurrentMod(mod)
        draw(true, false)
    }

    /**
     * This functions resets the game upon click to have replayability without refreshing
     */
    this.reset = function reset(){
        for (let i = 0; i < slapService.getEnemiesLength(); i++) {
            const enemy = slapService.getEnemiesAtIndex(i);
            enemy.health = enemy.maxHealth
            enemy.hits = 0
            enemy.currentMod = 1
            enemy.currentMods = []
        }
        slapService.reset()
        for (let i = 0; i < slapService.getPlayerWeaponLength(); i++) {
            const weapon = slapService.getPlayerWeaponAtIndex(i);
            if (i == 1){
                weapon.enabled = false
            } else {
                weapon.enabled = true
            }
            weapon.uses = 0
        }
        for (let i = 0; i < slapService.getEnemiesItemsLength(); i++) {
            const item = slapService.getEnemiesItemsAtIndex(i);
            item.enabled = false
        }
        draw(true, false)
    }

    draw(true, true)
}