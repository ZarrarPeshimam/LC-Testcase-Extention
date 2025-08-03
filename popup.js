// --- Helper Functions (copied from previous iterations, essential for generation) ---
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randChar = () => String.fromCharCode(randInt(97, 122));
const randFromStr = (chars) => chars[randInt(0, chars.length - 1)];

const generateIntArray = (length, min, max, mode, subStyle) => {
    let arr = [];
    if (subStyle === "unique") {
        const uniqueSet = new Set();
        while (uniqueSet.size < length) {
            uniqueSet.add(randInt(min, max));
            // Break if all possible unique numbers within range are generated
            if (uniqueSet.size === max - min + 1 && (max - min + 1) > 0) break;
        }
        arr = Array.from(uniqueSet);
    } else {
        for (let i = 0; i < length; i++) arr.push(randInt(min, max));
    }

    if (mode === "ascending") arr.sort((a, b) => a - b);
    else if (mode === "descending") arr.sort((a, b) => b - a);

    return arr.slice(0, length); // Ensure length constraint after sorting/generation
};

const generateCharArray = (length, subStyle) => {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    if (subStyle === "unique") {
        const shuffled = chars.split('').sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(length, chars.length));
    } else {
        return Array(length).fill(0).map(() => randChar());
    }
};

const generateString = (length, subStyle) => {
    let pool = "";

    switch (subStyle) {
        case "lowercase": 
            pool = "abcdefghijklmnopqrstuvwxyz"; 
            break;
        case "uppercase": 
            pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; 
            break;
        case "mixedcase": 
            pool = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"; 
            break;
        case "binary": 
            pool = "01"; 
            break;
        case "numeric": 
            pool = "0123456789"; 
            break;
        case "alphanumeric-lower": 
            pool = "abcdefghijklmnopqrstuvwxyz0123456789"; 
            break;
        case "alphanumeric-mixed": 
            pool = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; 
            break;
        case "alphanumeric-symbols-lower": 
            pool = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:'\"\\|,<.>/?`~"; 
            break;
        case "alphanumeric-symbols-mixed": 
            pool = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{};:'\"\\|,<.>/?`~"; 
            break;
        default: 
            pool = "abcdefghijklmnopqrstuvwxyz";
    }
    return Array.from({ length }, () => randFromStr(pool)).join("");
};

// --- UI Control Functions ---
function handleTypeChange(selectEl) {
    const group = selectEl.closest(".input-group");
    const numberFields = group.querySelector(".constraintFields.number");
    const stringFields = group.querySelector(".constraintFields.string-only");
    const arrayLengthFields = group.querySelector(".constraintFields.string-array");
    const arraySubtypeContainer = group.querySelector(".array-subtype-container");

    numberFields.style.display = "none";
    stringFields.style.display = "none";
    arrayLengthFields.style.display = "none";
    arraySubtypeContainer.style.display = "none";

    const intFields = group.querySelector(".array-int-fields");
    const charFields = group.querySelector(".array-char-fields");
    if (intFields) intFields.style.display = "none";
    if (charFields) charFields.style.display = "none";

    if (selectEl.value === "number") {
        numberFields.style.display = "block";
    } else if (selectEl.value === "string") {
        arrayLengthFields.style.display = "block";
        stringFields.style.display = "block";
    } else if (selectEl.value === "array") {
        arrayLengthFields.style.display = "block";
        arraySubtypeContainer.style.display = "block";
        const arraySubTypeSelect = group.querySelector(".arraySubType");
        if (arraySubTypeSelect) {
            handleArraySubTypeChange(arraySubTypeSelect);
        }
    }
}

function handleArraySubTypeChange(selectEl) {
    const container = selectEl.closest(".input-group");
    const intFields = container.querySelector(".array-int-fields");
    const charFields = container.querySelector(".array-char-fields");
    const modeField = container.querySelector(".modeField");

    intFields.style.display = "none";
    charFields.style.display = "none";
    if (modeField) modeField.style.display = "none";

    if (selectEl.value === "int") {
        intFields.style.display = "block";
        const arrayIntRepetitionSelect = container.querySelector(".arrayIntRepetition");
        if (arrayIntRepetitionSelect) {
            handleArrayIntRepetitionChange(arrayIntRepetitionSelect);
        }
    } else if (selectEl.value === "char") {
        charFields.style.display = "block";
    }
}

function handleArrayIntRepetitionChange(selectEl) {
    const group = selectEl.closest(".input-group");
    const modeField = group.querySelector(".modeField");

    if (modeField) {
        if (selectEl.value === "repetitive" || selectEl.value === "unique") {
            modeField.style.display = "block";
        } else {
            modeField.style.display = "none";
        }
    }
}

function handleDeleteInput(buttonEl) {
    const groupToRemove = buttonEl.closest(".input-group");
    const inputContainer = document.getElementById("inputContainer");

    if (inputContainer.children.length > 1) {
        groupToRemove.remove();
        document.getElementById("generateBtn").click();
    } else {
        // Show alert that the last input cannot be deleted
        alert("You cannot delete the last input field. Its contents have been cleared instead.");

        // Clear the last input group instead of removing it
        const inputNameEl = groupToRemove.querySelector(".inputName");
        const inputTypeEl = groupToRemove.querySelector(".inputType");
        const arraySubTypeEl = groupToRemove.querySelector(".arraySubType");

        inputNameEl.value = ""; // Clear input name
        inputTypeEl.value = ""; // Reset main type select to empty/disabled option
        if (arraySubTypeEl) arraySubTypeEl.value = ""; // Clear array subtype

        // Clear all number inputs
        groupToRemove.querySelectorAll('input[type="number"]').forEach(input => {
            input.value = '';
        });

        // Hide all constraint fields using 'none'
        groupToRemove.querySelectorAll(".constraintFields, .array-subtype-container, .array-int-fields, .array-char-fields, .modeField").forEach(div => {
            div.style.display = 'none';
        });

        // Clear any previous validation error styles
        groupToRemove.querySelectorAll('.border-red-500, .ring-red-300').forEach(el => {
            el.classList.remove('border-red-500', 'ring-2', 'ring-red-300');
        });

        document.getElementById("generateBtn").click(); // Re-generate buttons to update display
    }
}

function evaluateConstraint(base, power, offset) {
    return Math.pow(base || 0, power || 0) + (offset || 0);
}

function validateConstraints() {
    const inputs = document.querySelectorAll(".input-group");
    let isValid = true;

    for (let input of inputs) {
        const name = input.querySelector(".inputName")?.value.trim();
        const type = input.querySelector(".inputType")?.value;

        if (!name && !type) {
            continue;
        }

        if (name && !type) {
            alert(`Please select a type for input "${name}".`);
            isValid = false;
            break;
        }

        if (!name && type) {
            alert(`Please provide a name for the selected "${type}" input.`);
            isValid = false;
            break;
        }

        if (type === "array" && input.querySelector(".arraySubType")?.value === "") {
             alert(`Please select a subtype for array input "${name}".`);
             isValid = false;
             break;
        }

        if (type === "array" && input.querySelector(".arraySubType")?.value === "int") {
            const minBase = +input.querySelector(".minBase")?.value || 0;
            const minPower = +input.querySelector(".minPower")?.value || 0;
            const minOffset = +input.querySelector(".minOffset")?.value || 0;
            const minSign = input.querySelector(".minSign")?.value || 'negative';

            const maxBase = +input.querySelector(".maxBase")?.value || 0;
            const maxPower = +input.querySelector(".maxPower")?.value || 0;
            const maxOffset = +input.querySelector(".maxOffset")?.value || 0;

            let minVal = evaluateConstraint(minBase, minPower, minOffset);
            if (minSign === 'negative') {
                minVal = -minVal;
            }
            const maxVal = evaluateConstraint(maxBase, maxPower, maxOffset);

            if (minVal > maxVal) {
                alert(`⚠️ Min value (${minVal}) cannot be greater than Max value (${maxVal}) for Array (Integer) input "${name}".`);
                isValid = false;
                break;
            }
        }
    }
    return isValid;
}

// Function to handle copying a single variable from a button's data attribute
function copyVariableFromButton(buttonEl) {
    const valueToCopy = buttonEl.dataset.variableValue;

    if (valueToCopy) {
        navigator.clipboard.writeText(valueToCopy)
            .then(() => {
                const originalText = buttonEl.innerText;

                // --- Apply 'Copied!' state using Tailwind classes ---
                buttonEl.innerText = 'Copied!';
                // Remove the original blue classes
                buttonEl.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                // Add the green classes for copied state
                buttonEl.classList.add('bg-green-500', 'hover:bg-green-600'); // Using green-500 as it's common

                setTimeout(() => {
                    buttonEl.innerText = originalText;
                    // --- Revert to original state using Tailwind classes ---
                    // Remove the green classes
                    buttonEl.classList.remove('bg-green-500', 'hover:bg-green-600');
                    // Add back the original blue classes
                    buttonEl.classList.add('bg-blue-600', 'hover:bg-blue-700');
                }, 1500);
            })
            .catch(err => {
                console.error("Failed to copy text: ", err);
                alert("Failed to copy text. Please try manually copying.");
            });
    } else {
        console.warn("No value found to copy for this button.");
    }
}


// --- Main Generation and Display Logic ---
function generateAndDisplayTestCases() {
    const copyButtonsContainer = document.getElementById("copyButtonsContainer");
    copyButtonsContainer.innerHTML = '';

    if (!validateConstraints()) {
        const errorMessage = document.createElement('div');
        errorMessage.innerText = "⚠️ Please fix validation errors to generate copy options.";
        // Apply Tailwind classes for error message
        errorMessage.classList.add('text-red-600', 'mt-2', 'font-medium', 'text-sm');
        //errorMessage.style.marginTop = "10px";
        copyButtonsContainer.appendChild(errorMessage);
        return;
    }

    const groups = document.querySelectorAll(".input-group");
    const generatedData = [];

    groups.forEach(group => {
        const name = group.querySelector(".inputName")?.value.trim();
        const type = group.querySelector(".inputType")?.value;

        if (!name || !type) {
            return;
        }

        let generatedValue = "";

        if (type === "number") {
            const base = +group.querySelector(".constraintFields.number .base")?.value || 10;
            const power = +group.querySelector(".constraintFields.number .power")?.value || 0;
            const offset = +group.querySelector(".constraintFields.number .offset")?.value || 0;
            generatedValue = (Math.pow(base, power) + offset - 1).toString();
        } else if (type === "string") {
            const base = +group.querySelector(".constraintFields.string-array .base")?.value || 10;
            const power = +group.querySelector(".constraintFields.string-array .power")?.value || 0;
            const offset = +group.querySelector(".constraintFields.string-array .offset")?.value || 0;
            const stringType = group.querySelector(".stringType")?.value;
            const len = Math.max(1, evaluateConstraint(base, power, offset));
            generatedValue = `"${generateString(len, stringType)}"`;
        } else if (type === "boolean") {
            generatedValue = "true";
        } else if (type === "array") {
            const base = +group.querySelector(".constraintFields.string-array .base")?.value || 10;
            const power = +group.querySelector(".constraintFields.string-array .power")?.value || 0;
            const offset = +group.querySelector(".constraintFields.string-array .offset")?.value || 0;
            const len = Math.max(1, evaluateConstraint(base, power, offset));
            const arrayType = group.querySelector(".arraySubType")?.value;
            const subStyle = group.querySelector(".arrayIntRepetition")?.value || group.querySelector(".arrayCharRepetition")?.value || "repetitive";

            if (arrayType === "char") {
                const arr = generateCharArray(len, subStyle);
                generatedValue = `[${arr.map(c => `"${c}"`).join(",")}]`;
            } else if (arrayType === "int") {
                const minBase = +group.querySelector(".minBase")?.value || 0; // Changed default to 0 for number fields
                const minPower = +group.querySelector(".minPower")?.value || 0;
                const minOffset = +group.querySelector(".minOffset")?.value || 0;
                const minSign = group.querySelector(".minSign")?.value || 'negative';

                const maxBase = +group.querySelector(".maxBase")?.value || 0; // Changed default to 0 for number fields
                const maxPower = +group.querySelector(".maxPower")?.value || 0;
                const maxOffset = +group.querySelector(".maxOffset")?.value || 0;

                let minVal = evaluateConstraint(minBase, minPower, minOffset);
                if (minSign === 'negative') {
                    minVal = -minVal;
                }
                const maxVal = evaluateConstraint(maxBase, maxPower, maxOffset);
                const mode = group.querySelector(".mode")?.value || "random";

                const arr = generateIntArray(len, minVal, maxVal, mode, subStyle);
                generatedValue = `[${arr.join(",")}]`;
            } else {
                generatedValue = "[]";
            }
        }
        generatedData.push({ name: name, value: generatedValue });
    });

    if (generatedData.length === 0) {
        const noInputMessage = document.createElement('div');
        noInputMessage.innerText = "No valid inputs configured for generation. Add an input and define its type and name.";
        // Apply Tailwind classes for no input message
        noInputMessage.classList.add('text-gray-500', 'italic', 'text-sm', 'mt-2');
        copyButtonsContainer.appendChild(noInputMessage);
        return;
    }

    // --- Console Log Generated Data ---
    console.groupCollapsed("Generated Test Case Data");
    generatedData.forEach(item => {
        console.log(`Variable: ${item.name}, Value: ${item.value}`);
    });
    console.groupEnd();

    // --- Display only Copy Buttons ---
    generatedData.forEach(item => {
        const row = document.createElement('div');
        row.className = 'w-full flex items-center justify-between mb-2';

        const label = document.createElement('span');
        label.innerText = item.name;
        label.className = 'text-gray-800 font-medium text-sm';

        const copyButton = document.createElement('button');
        copyButton.className = 'bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-md text-sm transition duration-200';
        copyButton.innerText = 'Copy';
        copyButton.dataset.variableValue = item.value;
        copyButton.onclick = () => copyVariableFromButton(copyButton);

        row.appendChild(label);
        row.appendChild(copyButton);
        copyButtonsContainer.appendChild(row);
    });

}

// --- Event Listeners setup ---

document.querySelectorAll(".inputType").forEach((select) => {
    select.addEventListener("change", function () {
        handleTypeChange(this);
    });
});

document.querySelectorAll(".arraySubType").forEach((select) => {
    select.addEventListener("change", function () {
        handleArraySubTypeChange(this);
    });
});

document.querySelectorAll(".arrayIntRepetition").forEach((select) => {
    select.addEventListener("change", function () {
        handleArrayIntRepetitionChange(this);
    });
});

// Initial setup for the first delete button
const initialDeleteBtn = document.querySelector(".input-group .delete-btn");
if (initialDeleteBtn) { // Check if it exists (it should)
    initialDeleteBtn.addEventListener("click", function() {
    handleDeleteInput(this);
});
}

document.getElementById("addInput").addEventListener("click", () => {
    const container = document.getElementById("inputContainer");
    const firstGroup = document.querySelector(".input-group");
    const newGroup = firstGroup.cloneNode(true);

    newGroup.querySelectorAll("input, select").forEach((el) => {
        if (el.tagName === "SELECT") {
            // Reset select elements to their first option or default selected
            el.selectedIndex = 0;
            // For arrayIntRepetition, ensure it defaults to unique as per original HTML
            if (el.classList.contains('arrayIntRepetition')) {
                el.value = 'unique';
            }
            // For stringType, ensure it defaults to binary as per original HTML
            if (el.classList.contains('stringType')) {
                el.value = 'binary';
            }
             // For mode, ensure it defaults to random as per original HTML
            if (el.classList.contains('mode')) {
                el.value = 'random';
            }
        } else if (el.tagName === "INPUT") {
            // Clear all text/number inputs
            el.value = "";
            // Optionally, reset specific number fields to a specific default or empty
            // If you want them truly empty, just el.value = ""; is enough.
            // If you want to reset to HTML defaults like 10, 4, 0, you'd do:
            // if (el.classList.contains('base')) el.value = '10';
            // else if (el.classList.contains('power')) el.value = '4';
            // else if (el.classList.contains('offset')) el.value = '0';
        }
    });

    // Explicitly reset common number input default values to empty for a clean state
    // These are the inputs that had default values in the HTML
    newGroup.querySelector('.constraintFields.number .base').value = '10';
    newGroup.querySelector('.constraintFields.number .power').value = '4';
    newGroup.querySelector('.constraintFields.number .offset').value = '0';

    newGroup.querySelector('.constraintFields.string-array .base').value = '10';
    newGroup.querySelector('.constraintFields.string-array .power').value = '4';
    newGroup.querySelector('.constraintFields.string-array .offset').value = '0';

    newGroup.querySelector('.array-int-fields .minBase').value = '10';
    newGroup.querySelector('.array-int-fields .minPower').value = '4';
    newGroup.querySelector('.array-int-fields .minOffset').value = '0';
    newGroup.querySelector('.array-int-fields .maxBase').value = '10';
    newGroup.querySelector('.array-int-fields .maxPower').value = '4';
    newGroup.querySelector('.array-int-fields .maxOffset').value = '0';


    // Reset the new minSign dropdown to "negative"
    const newMinSignSelect = newGroup.querySelector(".minSign");
    if (newMinSignSelect) {
        newMinSignSelect.value = "negative";
        newMinSignSelect.selectedIndex = 0;
    }


    newGroup.querySelectorAll(".constraintFields, .array-subtype-container, .array-int-fields, .array-char-fields, .modeField").forEach(div => {
        div.style.display = "none";
    });

    newGroup.querySelector(".inputType").addEventListener("change", function () {
        handleTypeChange(this);
    });

    newGroup.querySelector(".arraySubType").addEventListener("change", function () {
        handleArraySubTypeChange(this);
    });

    newGroup.querySelector(".arrayIntRepetition").addEventListener("change", function () {
        handleArrayIntRepetitionChange(this);
    });

    newGroup.querySelector(".delete-btn").addEventListener("click", function() {
        handleDeleteInput(this);
    });

    container.appendChild(newGroup);
});


document.getElementById("generateBtn").addEventListener("click", generateAndDisplayTestCases);

// Optional: Automatically generate buttons when popup opens
// window.addEventListener('DOMContentLoaded', generateAndDisplayTestCases);