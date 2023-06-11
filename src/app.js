class JSONFIELDS {
    constructor(selector, userData = {}) {
        this.data = userData;
        this.ContainerForm = null;
        this.Container = document.querySelector(selector);

        this.buildEnviroment();
        this.eachData(userData);

        return {
            submit: () => this.submitJSON(),
        };
    }

    defaulStyles() {
        return `
            .jsonfields-container {
                display: block;
                width: 100%;
                height: auto;
                min-height: 200px;
                padding: 10px;
                border: 1px solid gray;
                border-radius: 10px;
            }

            .jsonfields-addProperty {
                display: flex;
                justify-content: center;
            }

            .jsonfields-contentForm {
                display: block;
                width: 100%;
                margin-bottom: 10px;
            }
            .jsonfields-contentForm .input-group {
                display: grid;
                grid-template-columns: 50px 0.6fr 1fr 50px 50px;
                grid-template-rows: 1fr;
                margin-top: 10px;
                position: relative;
            }
            .jsonfields-contentForm .input-group.hide {
                display: none !important;
            }
            .jsonfields-contentForm .input-group.just-key input:nth-child(2) {
                grid-column: 2 / span 2;
            }
            .jsonfields-contentForm .input-group.just-key input:nth-child(3) {
                display: none;
            }
        `;
    }

    buildEnviroment() {
        const WrapForm = document.createElement("div");
        const WrapBtnAdd = document.createElement("div");
        const StyleTag = document.createElement("style");

        // Append styles
        StyleTag.setAttribute("type", "text/css");
        StyleTag.textContent = this.defaulStyles();
        document.querySelector("head").appendChild(StyleTag);

        // Add settings Main Container
        this.Container.classList.add("jsonfields-container");

        // Append Wrap from
        WrapForm.classList.add("jsonfields-contentForm");
        this.ContainerForm = WrapForm;
        this.Container.appendChild(WrapForm);

        // Append Wrap button add element
        WrapBtnAdd.classList.add("jsonfields-addProperty");
        WrapBtnAdd.innerHTML = '<button type="button">Add property</button>';
        WrapBtnAdd.querySelector("button").addEventListener("click", (e) => this.AddProperty(e.currentTarget));
        this.Container.appendChild(WrapBtnAdd);
    }

    // Method that takes care to BUILD NEW PROPERTY. This method just return an element not append.
    BuildElement(key = "", value = "") {
        const Wrap = document.createElement("div");
        const InputKey = document.createElement("input");
        const InputValue = document.createElement("input");
        const InputCheckbox = document.createElement("input");
        const BtnRemove = document.createElement("button");
        const BtnAddNested = document.createElement("button");
        const isArray = Array.isArray(value);
        const isObject = typeof value === "object" && !isArray;

        // Set Wrap element
        Wrap.classList.add("input-group");
        if (isObject) Wrap.classList.add("just-key");

        // Set Checkbox input element
        if (isObject) InputCheckbox.checked = true;
        InputCheckbox.type = "checkbox";
        InputCheckbox.title = "Just key";
        InputCheckbox.addEventListener("change", (e) => this.CheckboxAction(e));
        Wrap.appendChild(InputCheckbox);

        // Set Input key
        InputKey.type = "text";
        InputKey.value = key;
        InputKey.name = "key";
        InputKey.classList.add("form-control");
        InputKey.placeholder = "Write key name";
        Wrap.appendChild(InputKey);

        // Set Input value
        if (isArray) {
            const ContentInputValue = document.createElement("div");
            ContentInputValue.classList.add("array-list");

            value.forEach((val) => {
                const InputItem = document.createElement("input");
                InputItem.type = "text";
                InputItem.readOnly = true;
                InputItem.value = val;
                ContentInputValue.appendChild(InputItem);
            });

            Wrap.appendChild(ContentInputValue);
        } else {
            InputValue.type = "text";
            InputValue.name = "value";
            InputValue.value = !isObject ? value : "";
            InputValue.classList.add("form-control");
            if (isObject) InputValue.classList.add("hide");
            InputValue.placeholder = "Write value of property";
            Wrap.appendChild(InputValue);
        }

        // Set Button add nested element
        BtnAddNested.type = "button";
        BtnAddNested.classList.add("btn-add-nestedElem");
        BtnAddNested.title = "Add nested property";
        BtnAddNested.innerHTML = "<span></span>";
        BtnAddNested.addEventListener("click", (e) => this.AddProperty(e.currentTarget, true));
        Wrap.appendChild(BtnAddNested);

        // Set Button remove element
        BtnRemove.type = "button";
        BtnRemove.classList.add("btn-remove-elem");
        BtnRemove.title = "Remove property";
        BtnRemove.innerHTML = "<span></span>";
        BtnRemove.addEventListener("click", (e) => this.RemoveProperty(e.currentTarget));
        Wrap.appendChild(BtnRemove);

        // Return the wrap with all the elements
        return Wrap;
    }

    // Method that takes care to append new elements in their correct place, handle indexes, and update attributes and properties.
    AppendElement({ Element, Sibling, keypath }) {
        let nestedSteps = keypath ? keypath.split(".").length - 1 : 0;
        if (nestedSteps) Element.style.paddingLeft = `${nestedSteps * 1.5}rem`;

        Element.dataset.keypath = keypath;

        if (nestedSteps && Sibling) {
            this.ContainerForm.insertBefore(Element, Sibling.nextSibling);
        } else {
            this.ContainerForm.appendChild(Element);
        }
    }

    // Method that takes care to create a new property in the JSONFIELDS
    AddProperty(Target, isNested) {
        let promptNewKey = prompt("Write key name for the new property");

        if (!promptNewKey) {
            alert("The key name cannot be an empty text");
        } else {
            promptNewKey = promptNewKey.replace(/\s/g, "");

            if (isNested) {
                const Parent = Target.parentNode;
                const Checkbox = Parent.querySelector('input[type="checkbox"]');

                this.AppendElement({
                    Element: this.BuildElement(promptNewKey),
                    Sibling: Parent,
                    keypath: Parent.dataset.keypath + "." + promptNewKey,
                });

                if (!Checkbox.checked) Checkbox.click();
            } else {
                this.AppendElement({
                    Element: this.BuildElement(promptNewKey),
                    keypath: promptNewKey,
                });
            }
        }
    }

    // Method that takes care to remove property in the JSONFIELDS
    RemoveProperty(Target) {
        const confirmRemove = confirm("Are you sure that you want to remove the selected property?");
        const Parent = Target.parentNode;
        const checkboxOK = Parent.querySelector('[type="checkbox"]').checked;

        if (confirmRemove) {
            Parent.remove();

            if (checkboxOK) this.RemoveOrHideNestedElements(Parent, "remove");
        }
    }

    // Method that handler visualization from nested elements
    RemoveOrHideNestedElements(Parent, action) {
        const parentKeypath = Parent.dataset.keypath;
        const NestedElements = this.ContainerForm.querySelectorAll(`[data-keypath*="${parentKeypath}"]`);

        [...NestedElements].forEach((Elem, index) => {
            if (action === "hide" && index > 0) {
                Elem.classList.add("hide");
            } else if (action === "show" && index > 0) {
                Elem.classList.remove("hide");
            } else if (action === "remove") {
                Elem.remove();
            }
        });
    }

    // Method that takes care to handle actions from checkbox
    CheckboxAction(event) {
        const Checkbox = event.currentTarget;
        const Parent = Checkbox.parentNode;
        const isChecked = Checkbox.checked;

        if (!isChecked) {
            Parent.classList.remove("just-key");
        } else {
            Parent.classList.add("just-key");
        }

        this.RemoveOrHideNestedElements(Parent, isChecked ? "show" : "hide");
    }

    // Method that takes care to read and insert user data
    eachData(data, prevKey) {
        let index = 0;

        for (let key in data) {
            const value = data[key];
            const isObject = typeof value === "object";
            const isArray = Array.isArray(value);

            // Get path keys
            let keypath = prevKey ? `${prevKey}.${key}` : key;

            // Append element
            const newElement = this.BuildElement(key, value);
            this.AppendElement({
                Element: newElement,
                keypath,
            });

            index++;

            if (isObject && !isArray) this.eachData(value, keypath);
        }
    }

    // Submit JSON
    submitJSON() {
        const AllInputGroups = this.ContainerForm.querySelectorAll(".input-group");
        var jsonObject = {};

        [...AllInputGroups].forEach((Elem) => {
            const keypath = Elem.dataset.keypath.split(".");
            const value = Elem.querySelector('[name="value"]').value;
            const isObject = Elem.querySelector('[type="checkbox"]').checked;

            let currentObj = jsonObject;
            keypath.forEach((key, index) => {
                if (isObject && !currentObj[key]) {
                    currentObj[key] = {};
                } else if (index === keypath.length - 1) {
                    currentObj[key] = value;
                } else {
                    currentObj = currentObj[key];
                }
            });
        });

        return jsonObject;
    }
}

export default JSONFIELDS;
