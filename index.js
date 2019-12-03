const appId = "df2e7bdf";
const appKey = "e1d29fa29c215f19e1408451b2c270b4";
const baseUrl = "https://api.edamam.com/search";

//This function listens for the click events happened on the filters.

function filterListener(){
/*Below listen for the diet type filter.
    $('.diet-type-option').click(event => {
        //When click on filter option, unselect the "No Preference" button.
        $('#diet-no-preference').prop('checked',false);

        //When all filter options are unchecked, the "No Preference" button is automaically back on. 
        let ifChecked = false;
        $('.diet-type-option').each(function(){
            if ($(this).prop('checked')){
                ifChecked = true;
            } 
        })
        if (!ifChecked) {
            $('#diet-no-preference').prop('checked',true);
        }
    })

    //when click on 'No Preference' button, unselect the rest checkboxes.
    $('#diet-no-preference').click(event => {
        $('.diet-type-option').prop('checked',false);
    });
*/
//Below listen for the health concern filter.
    $('.health-concern-option').click(event => {
        //When click on filter option, unselect the "No Preference" button.
        $('#health-no-preference').prop('checked',false);

        //When all filter options are unchecked, the "No Preference" button is automaically back on. 
        let ifChecked = false;
        $('.health-concern-option').each(function(){
            if ($(this).prop('checked')){
                ifChecked = true;
            } 
        })
        if (!ifChecked) {
            $('#health-no-preference').prop('checked',true);
        }
    })

    //when click on 'No Preference' button, unselect the rest checkboxes.
    $('#health-no-preference').click(event => {
        $('.health-concern-option').prop('checked',false);
    });
}


function checkCalorieInput(min,max) {
    console.log('checkcalorieinput')
    let minCal = "0";
    let maxCal = "10000";
    if (min != ""){
        minCal = min;
    }
    if (max != ""){
        maxCal = max;
    }
    return `${minCal}-${maxCal}`
}


function formatParameter(paramValueObj){
    const paramArr = Object.keys(paramValueObj); // ["app_id","app_key","q"]
    const paramValueArr = paramArr.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(paramValueObj[key])}`); //["app_id=xxxxx","app_key=xxxx","q=chicken,tomato"]
    return paramValueArr.join('&');
}

function displayResults(responseJson){
    let totalResultNumber = responseJson.count;
    let recipeArr = responseJson.hits;
    $('#display-result').removeClass('hidden');
    $('#search-result-number').text(totalResultNumber);
    for (let i = 0 ; i < 10 ; i++){
        let recipeName = recipeArr[i].recipe.label;
        console.log(recipeName);
        let recipeImage = recipeArr[i].recipe.image;
        let recipeUrl = recipeArr[i].recipe.url;
        let recipeCalorie = recipeArr[i].recipe.calories;
        let recipeYield = recipeArr[i].recipe.yield
        $('#result-list').append(
            `<li><h3>${recipeName}</h3>
            <p><img src="${recipeImage}"></p>
            <p>Serving Size: ${recipeYield}</p>
            <p>Total Calories: ${recipeCalorie.toFixed(2)} KCal / ${(recipeCalorie / recipeYield).toFixed(2)} KCal per Serving</p>
            <p><a href="${recipeUrl}">Click to read the recipe</a></p>
            </li>`)
    }
}

function getRecipes(userInput,calorieRange,dietType){
    console.log('getRecipes')
    const queryArr = userInput.toLowerCase().split(",")// ["chicken","tomato"]
    const completeQuery = queryArr.join(","); // "chick,tomato"

    const param = {
        app_id: appId,
        app_key: appKey,
        q: completeQuery,
        calories: calorieRange,
        diet: dietType
    };

    if (dietType === "no-preference"){
        delete param.diet;
    }

    console.log(param)

    const queryString = formatParameter(param);
    const finalUrl = baseUrl + '?' + queryString;
    console.log(finalUrl);

    fetch(finalUrl)
        .then(response => {
            if (response.ok){
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`)
        })
}


function watchForm(){
    $('#main-form').submit(event => {
        console.log('hello')
        event.preventDefault();
        const searchTerm = $('#js-search-bar').val();  
        const minCal = $('#min-cal').val();
        const maxCal = $('#max-cal').val();
        const calories = checkCalorieInput(minCal,maxCal);
        const dietTypeSelected = $('.diet-type-option:checked').val();
        getRecipes(searchTerm,calories,dietTypeSelected);
        //$('#js-search-bar').val("");
        //$('#min-cal').val("");
        //$('#max-cal').val("");
        $('#result-list').empty();
        $('#js-error-message').empty();
    })
}


$(filterListener);
$(watchForm);


