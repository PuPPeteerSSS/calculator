'use strict';

const title = document.getElementsByClassName('h1')[0],
    mainControlsViews = document.querySelector('.main-controls__views'),
    startBtn = document.getElementsByClassName('handler_btn')[0],
    resetBtn = document.getElementsByClassName('handler_btn')[1],
    buttonPlus = document.querySelector('.screen-btn'),
    percentItems = document.querySelectorAll('.other-items.percent'),
    numberItems = document.querySelectorAll('.other-items.number'),
    inputRange = document.querySelector('input[type=range]');

const total = document.getElementsByClassName('total-input')[0],
    totalCountInput = document.getElementsByClassName('total-input')[1],
    totalCountOtherInput = document.getElementsByClassName('total-input')[2],
    totalFullCountInput = document.getElementsByClassName('total-input')[3],
    totalCountRollbackInput = document.getElementsByClassName('total-input')[4],
    resInps = document.querySelectorAll('.total-input'),
    cmsItem = document.querySelector('#cms-open'),
    cmsSelect = document.querySelector('.hidden-cms-variants'),
    cmsSelectItems = cmsSelect.querySelector('#cms-select'),
    cmsInputItems = cmsSelect.querySelector('.main-controls__input');

let screens = document.querySelectorAll('.screen');
let inputRangeValue = document.querySelector('.rollback').querySelector('.range-value');

const appData = {
    title: '',
    screens: [],
    screenPrice: 0,
    rollback: 0,
    servicePricesPercent: 0,
    servicePricesNumber: 0,
    fullPrice: 0,
    servicePercentPrice: 0,
    servicesPercent: {},
    isEmpty: false,
    cmsProcent: 0,
    init: function () {
        buttonPlus.addEventListener('click', addScreenBlock);
        inputRange.addEventListener('input', getRollback);
        cmsItem.addEventListener('change', getCms);
        cmsSelectItems.addEventListener('change', getCmsItem);
        startBtn.addEventListener('click', startRes);
        resetBtn.addEventListener('click', reloadForm);
    }
}

function startRes() {
    screens = document.querySelectorAll('.screen');
    let screensInps = document.querySelectorAll('.screen input');
    let screensSelects = document.querySelectorAll('.screen select');
    let trueScreensInp = 0;
    let trueScreensSelect = 0;

    //Проверка select на пустое значение
    screensSelects.forEach(el => {
        if(el.value == "") {
            return;
        } else {
            trueScreensSelect += 1;
        }
    })
    //Проверка input на пустое значение
    screens.forEach(el => {
        if(el.querySelector('input').value == ""){
            return;
        } else {
            trueScreensInp += 1;
        }
    }) 
    // Если количество не пустых input будет равно кол-ву input
    // И если количество не пустых select будет равно кол-ву select
    if(trueScreensInp == screensInps.length && trueScreensSelect == screensSelects.length) {
        // Расчет результатов
        pricePercentRes();
        priceNumRes();
        getScreens();
        setCmsProcent();
        getRes();
        blockRes();
    }
    
}
function reloadForm() {
    screens = document.querySelectorAll('.screen');
    let screensSelects = document.querySelectorAll('.screen select');
    let otherItems = document.querySelectorAll('.other-items .main-controls__checkbox .custom-checkbox');
    //Убираем disable и value у input 
    screens.forEach(el => {
        el.querySelector('input').disabled = false;
        el.querySelector('input').value = "";
    }) 
    //Убираем disable и value у select 
    screensSelects.forEach(el => {
        el.disabled = false;
        el.value = '';
    }) 
    //Ставим начальное value у inputs в результатах 
    resInps.forEach(el => {
        el.value = '0';
    })
    //Убираем disable и checked у checkbox 
    otherItems.forEach(el => {
        el.disabled = false;
        if(el.checked) {
            el.checked = false;
        }
    })
    //Убираем disable у checkbox, select и input CMS
    cmsItem.disabled = false;
    cmsItem.checked = false;
    getCms();
    cmsSelectItems.value = '';
    cmsSelectItems.disabled = false;
    cmsInputItems.querySelector('input').disabled = false;
    cmsInputItems.style.display = 'none';
    cmsInputItems.querySelector('input').value = '';
    //Ставим начальное значение у inputRange
    inputRange.value = '0';
    inputRangeValue.innerHTML = inputRange.value;

    //Убираем кнопку "Сброс"
    buttonPlus.addEventListener('click', addScreenBlock);
    resetBtn.style.display = 'none';
}
function blockRes() {
    screens = document.querySelectorAll('.screen');
    let screensSelects = document.querySelectorAll('.screen select');
    let otherItems = document.querySelectorAll('.other-items .main-controls__checkbox .custom-checkbox');
    //Добавляем кнопку "Сброс"
    resetBtn.style.display = 'block';
    
    //Добавляем disable к input
    screens.forEach(el => {
        el.querySelector('input').disabled = true;
    }) 

    //Добавляем disable к select
    screensSelects.forEach(el => {
        el.disabled = true;
    }) 

    //Добавляем disable к checkbox
    otherItems.forEach(el => {
        el.disabled = true;
    })
    //Добавляем disable к checkbox, select и input CMS
    cmsItem.disabled = true;
    cmsSelectItems.disabled = true;
    cmsInputItems.querySelector('input').disabled = true;
    //Убираем возможность добавлять новые экраны
    buttonPlus.removeEventListener('click', addScreenBlock);
}
function setCmsProcent() {
    if(cmsSelectItems.value == 50) {
        appData.cmsProcent = 50;
    } else if(cmsSelectItems.value == 'other'){
        appData.cmsProcent = cmsInputItems.querySelector('input').value;
    }
}
function getCms() {
    if(cmsItem.checked) {
        cmsSelect.style.display = 'block';
    } else {
        cmsSelect.style.display = 'none';
    }
}
function getCmsItem() {
    if(cmsSelectItems.value == 'other') {
        cmsInputItems.style.display = 'block';
    } else {
        cmsInputItems.style.display = 'none';
    }
}
function getRes() {
    total.value = appData.screenPrice;
    totalCountInput.value = appData.screens;
    totalCountOtherInput.value = (total.value * appData.servicePricesPercent / 100 
        + appData.servicePricesNumber
        + (total.value * appData.cmsProcent / 100)).toFixed(0);
    totalFullCountInput.value = Number(total.value) + Number(totalCountOtherInput.value);
    totalCountRollbackInput.value = totalFullCountInput.value - (totalFullCountInput.value * appData.rollback / 100);
}
function addScreenBlock() {
    screens.forEach(item => {
        let formScreen = item.cloneNode(true);
        mainControlsViews.insertBefore(formScreen, buttonPlus);
        formScreen.querySelector('.main-controls__input').querySelector('input').value = '';

        //     let closeControls = document.createElement('button');
        //     closeControls.classList.add('close-btn');
        //     closeControls.innerHTML = '-';
        //     formScreen.querySelector('.main-controls__input').querySelector('input').appendChild(closeControls);
        // })
        // // При клике удаляет форму
        // closeControls.addEventListener('click', ()=> {
        //     formScreen.remove();
    })




}
function getRollback() {
    // Онлайн значение input range
    inputRangeValue.innerHTML = `${inputRange.value}%`;
    appData.rollback = inputRange.value;
}
function pricePercentRes() {
    percentItems.forEach(num => {
        const checkbox = num.querySelector('input[type=checkbox]');
        const price = num.querySelector('input[type=text]');
        if (checkbox.checked) {
            appData.servicePricesPercent += Number(price.value);
        }
    })
}
function priceNumRes() {
    numberItems.forEach(num => {
        const checkbox = num.querySelector('input[type=checkbox]');
        const price = num.querySelector('input[type=text]');
        if (checkbox.checked) {
            appData.servicePricesNumber += Number(price.value);
        }
    })
}
function getScreens() {
    screens.forEach(num => {
        let contScreen = num.querySelector('.main-controls__input').querySelector('input').value;
        let contScreenSelect = num.querySelector('.main-controls__select').querySelector('select').value;
        appData.screens += contScreen;
        appData.screenPrice += contScreen * contScreenSelect;
    })
}

appData.init();