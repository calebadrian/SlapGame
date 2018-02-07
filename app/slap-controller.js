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
                <h4>Name: ${slapService.getPlayer().name}</h4>
                <h4>Health: ${slapService.getPlayer().health}</h4>
                <h4>Hits: ${slapService.getPlayer().hits}</h4>
            </div>
            <div class="col-sm-6 p-t-1">
                <h4>Name: ${slapService.getEnemiesAtIndex(slapService.getPlayer().defeated).name}</h4>
                <h4>Health: ${slapService.getEnemiesAtIndex(slapService.getPlayer().defeated).health}</h4>
                <h4>Hits: ${slapService.getEnemiesAtIndex(slapService.getPlayer().defeated).hits}</h4>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6 col-sm-12 col-format">
                <img src="https://calebadrian.github.io/SlapGame/assets/photos/player.png" alt="" class="resize shake" id="player-img">
                    <div class="progress m-b-1">
                        <div class="progress-bar progress-bar-striped progress-bar-animated bg-danger" role="progressbar" style="width: ${slapService.getPlayer().health}%" aria-valuenow="${slapService.getPlayer().health}" aria-valuemin="0" aria-valuemax="100">${slapService.getPlayer().health} hp</div>
                    </div>
                    <div class="row">`
        for (let i = 0; i < slapService.getPlayer().weapons.length; i++) {
            const weapon = slapService.getPlayer().weapons[i];
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
                        <h4>Currently Equipped Weapon: ${slapService.getPlayer().equipped}</h4>
                        <h4>Current Weapon Uses: ${slapService.getPlayerEquippedUseLimit() - slapService.getPlayerEquippedUses()}</h4>
                        <h4>${slapService.getPlayer().dead}</h4>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-sm-12 col-format">
            <img src="${slapService.getEnemiesAtIndex(slapService.getPlayer().defeated).img}" alt="" class="resize">
            <div class="progress m-b-1">
                <div class="progress-bar bg-danger progress-bar-striped progress-bar-animated" role="progressbar" style="width: ${slapService.getEnemiesAtIndex(slapService.getPlayer().defeated).health}%" aria-valuenow="${slapService.getEnemiesAtIndex(slapService.getPlayer().defeated).health}%}" aria-valuemin="0" aria-valuemax="${slapService.getEnemiesAtIndex(slapService.getPlayer().defeated).maxHealth}%}">${slapService.getEnemiesAtIndex(slapService.getPlayer().defeated).health} hp</div>
            </div>
                <div class="row">
        `

        for (let i = 0; i < slapService.getEnemiesAtIndex(slapService.getPlayer().defeated).items.length; i++) {
            const item = slapService.getEnemiesAtIndex(slapService.getPlayer().defeated).items[i];
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
                        <h4>${slapService.getEnemiesAtIndex(slapService.getPlayer().defeated).dead}</h4>
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
        if (slapService.getPlayer().dead != "") {
            slapService.setPlayerDead("")
        }
        var attack = slapService.getEnemiesAtIndex(slapService.getPlayer().defeated).attacks[((Math.floor(Math.random())) * (slapService.getEnemiesAtIndex(slapService.getPlayer().defeated).attacks.length))]
        var damageDealt = Math.floor(Math.random() * attack.damage)
        slapService.decPlayerHealth(damageDealt)
        if (damageDealt == 0) {
            slapService.setPlayerDead("You dodged " + slapService.getEnemiesAtIndex(slapService.getPlayer().defeated).name + "'s attack!")
            return
        }
        slapService.incPlayerHits()
    }

    function checkHealth(){
        if (slapService.getEnemiesAtIndex(slapService.getPlayer().defeated).health <= 0 && slapService.getPlayer().health > 0){
            slapService.incPlayerDefeated()
            slapService.setEnemiesDeadDefeated()
            if (slapService.getEnemiesAtIndex(slapService.getPlayer().defeated).name == "Game Over"){
                for (let i = 0; i < slapService.getPlayer().weapons.length; i++) {
                    slapService.setPlayerWeaponProp(i, 'enabled', false)          
                }
                for (let i = 0; i < slapService.getEnemiesAtIndex(slapService.getPlayer().defeated).items.length; i++) {
                    slapService.setEnemiesItemsProp(i, 'enabled', true)
                }
                slapService.setPlayerDead("You Win!")
                draw(false, false)
                return slapService.getPlayer().dead
            }
        } else if (slapService.getPlayer().health <= 0){
            slapService.setPlayerDead("You Died!")
            for (let i = 0; i < slapService.getPlayer().weapons.length; i++) {
                slapService.setPlayerWeaponProp(i, 'enabled', false)          
            }
            for (let i = 0; i < slapService.getEnemiesAtIndex(slapService.getPlayer().defeated).items.length; i++) {
                slapService.setEnemiesItemsProp(i, 'enabled', true)
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
        if (slapService.getEnemiesAtIndex(slapService.getPlayer().defeated).dead != "") {
            slapService.setEnemiesDead("")
        }
        if (weaponChoice == 'Switch Weapon' && slapService.getPlayerWeaponProp(2, 'enabled') == true) {
            if (slapService.getPlayer().equipped == "Axe") {
                if (slapService.getPlayer().weapons[1]['uses'] >= slapService.getPlayer().weapons[1]['uselimit']) {
                    slapService.setPlayerWeaponProp(1, 'enabled', false)
                } else {
                    slapService.setPlayerWeaponProp(1, 'enabled', true)
                }
                slapService.setPlayerEquipped("Sword")
                slapService.setPlayerWeaponProp(0, 'enabled', false)
                if (slapService.getEnemiesAtIndex(slapService.getPlayer().defeated).dead != "") {
                    slapService.setEnemiesDead("")
                }
                checkHealth()
                enemyAttack()
                checkHealth()
                draw(false, false)
                return
            } else {
                if (slapService.getPlayer().weapons[0]['uses'] >= slapService.getPlayer().weapons[0]['uselimit']) {
                    slapService.setPlayerWeaponProp(0, 'enabled', false)
                } else {
                    slapService.setPlayerWeaponProp(0, 'enabled', true)
                }
                slapService.setPlayerEquipped("Axe")
                slapService.setPlayerWeaponProp(1, 'enabled', false)
                if (slapService.getEnemiesAtIndex(slapService.getPlayer().defeated).dead != "") {
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
        for (let i = 0; i < slapService.getPlayer().weapons.length; i++) {
            if (weaponChoice == slapService.getPlayer().weapons[i].name && slapService.getPlayer().weapons[i].enabled == true) {
                slapService.incPlayerWeaponUses(i)
                if (slapService.getPlayer().weapons[i].uses == slapService.getPlayer().weapons[i].uselimit) {
                    slapService.setPlayerWeaponProp(i, 'enabled', false)
                }
                var damageCalc = Math.floor(Math.random() * slapService.getPlayer().weapons[i].damage) * slapService.getEnemiesAtIndex(slapService.getPlayer().defeated).currentMod
                slapService.setEnemiesHealth(damageCalc)
                if (damageCalc == 0) {
                    slapService.setEnemiesDead(slapService.getEnemiesAtIndex(slapService.getPlayer().defeated).name + " dodged your attack")
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
        if (slapService.getPlayer().health <= 0 || slapService.getPlayer().dead == "You Win!") {
            return
        }
        if (slapService.getPlayer().equipped == slapService.getPlayer().weapons[0]['name']) {
            slapService.setPlayerWeaponProp(0, 'uses', 0)
            slapService.setPlayerWeaponProp(0, 'enabled', true)
            if (slapService.getEnemiesAtIndex(slapService.getPlayer().defeated).dead != "") {
                slapService.setEnemiesDead("")
            }
            enemyAttack()
            checkHealth()
            draw(false, false)
            return
        } else {
            slapService.setPlayerWeaponProp(1, 'uses', 0)
            slapService.setPlayerWeaponProp(1, 'enabled', true)
            if (slapService.getEnemiesAtIndex(slapService.getPlayer().defeated).dead != "") {
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
            slapService.setEnemiesPropAtIndex(i, 'health', slapService.getEnemiesAtIndex(i).maxHealth)
            slapService.setEnemiesPropAtIndex(i, 'hits', 0)
            slapService.setEnemiesPropAtIndex(i, 'currentMod', 1)
            slapService.setEnemiesPropAtIndex(i, 'currentMods', [])
        }
        slapService.playerReset()
        for (let i = 0; i < slapService.getPlayer().weapons.length; i++) {
            if (i == 1){
                slapService.setPlayerWeaponProp(i, 'enabled', false)
            } else {
                slapService.setPlayerWeaponProp(i, 'enabled', true)
            }
            slapService.setPlayerWeaponProp(i, 'uses', 0)
        }
        for (let i = 0; i < slapService.getEnemiesAtIndex(slapService.getPlayer().defeated).items.length; i++) {
            slapService.setEnemiesItemsProp(i, 'enabled', false)
        }
        draw(true, false)
    }

    draw(true, true)
}