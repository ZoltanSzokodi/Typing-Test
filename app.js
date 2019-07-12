// Query selectors
const output = document.querySelector('.output');
const output_text = document.querySelector('.output-text');
const speed_result = document.querySelector('.speed-result');
const count_result = document.querySelector('.count-result');
const text_area = document.querySelector('.textarea');
const button = document.querySelector('.btn')


// Global variable
let start_time, end_time, total_time;


// Event listener for the test button
button.addEventListener('click', runApp);


// Start test (button callback)
function runApp() {
    // Fetch random text from API
    getRandomAvice();
    // Separate event listener for submitting input
    window.addEventListener('keypress', stopApp);

}

// Fetch random advice text
async function getRandomAvice() {
    const url = 'https://api.adviceslip.com/advice';
    await fetch(url)
        .then(async (response) => {
            return await response.json()
        })
        .then(async function getData(data) {
            let advice = data.slip.advice;
            let that = this;

            // Check for proper length
            if (advice.split(' ').length < 15) {
                getRandomAvice()
            } else {

                // Set up new game
                output_text.innerText = advice;
                text_area.value = '';
                text_area.disabled = false;
                text_area.focus();
                speed_result.innerText = 'Number of words typed per minute';
                count_result.innerText = 'Number of words typed correctly';

                // Start timer
                let date = new Date();
                start_time = date.getTime();
            }
        })
}

// Submit input (keypress callback)
function stopApp(event) {
    if (event.keyCode === 13) {
        if (text_area.value === '') {
            output_text.innerText = 'Please type in the textarea.';
            text_area.disabled = true;
            button.disabled = true;
            setTimeout(function () {
                reset();
            }, 2000);

        } else {
            let player_input = text_area.value;

            // Stop timer
            let date = new Date();
            end_time = date.getTime();

            // Calc how long did it take to type
            total_time = (end_time - start_time) / 1000;
            text_area.disabled = true;
            window.removeEventListener('keypress', stopApp);

            // Render speed and num of corrent words
            calculateSpeed(player_input);
            compareWords(player_input);
        }
    }
}

// Calc words per minute
function calculateSpeed(input) {
    let data_obj = {};
    data_obj.word_count = input.split(' ').length;
    data_obj.speed = Math.round((data_obj.word_count / total_time) * 60)
    let final_message_speed = `You typed at ${data_obj.speed} words per minute.`;
    speed_result.innerText = final_message_speed;
}

// Compare output and input strings
function compareWords(input) {
    let words_1 = input.split(' ');
    let words_2 = output_text.innerText.split(' ');
    let final_messsage_words;
    let count = 0;
    words_1.forEach((word, index) => {
        if (word == words_2[index]) {
            count++;
        }
    })
    if (words_1.length > words_2.length) {
        final_messsage_words = `You typed ${words_1.length - words_2.length} words too many. Please try again.`;
        count_result.innerText = final_messsage_words;
    } else if (words_1.length < words_2.length) {
        final_messsage_words = `Your text is ${words_2.length - words_1.length} words too short. Please try again.`;
        count_result.innerText = final_messsage_words;
    } else {
        final_messsage_words = `You got ${count} words right out of ${words_2.length}`;
        count_result.innerText = final_messsage_words;
    }

}

// Reset callback incase enter is pressed with 0 input
function reset() {
    text_area.value = '';
    text_area.disabled = true;
    button.disabled = false;
    button.innerText = 'Take Test';
    output_text.innerText = 'Welcome to the Typing Test! Check how fast you can type.';
    text_area.value = 'After clicking the \'Take Test\' button type the text appearing above as fast as you can. The length of your text has to be the same as the example\'s. When finished push Enter to view your results. Good luck! :)'
}
