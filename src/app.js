class JSONFIELDS {
    constructor(userOpts, userData = {}) {
        this.defaultOpts = {
            selector: typeof userOpts === "string" ? userOpts : userOpts.selector,
            bootstrapSupport: false,
            textContent: {},
            icons: {},
        };
        this.opts = typeof userOpts === "object" ? { ...this.defaultOpts, ...userOpts } : this.defaultOpts;
        this.data = userData;
        this.ContainerForm = null;
        this.Container = document.querySelector(this.opts.selector);

        // Define text content
        this.txt = {
            radioDefaultTitle: "Data type: String",
            radioObjectTitle: "Data type: Object",
            radioArrayTitle: "Data type: Array",
            inputKeyPlaceholder: "Write key name",
            inputValueObjectPlaceholder: "Write value of property",
            inputValueArrayPlaceholder: "Write a new value for the array",
            btnAddObject: "Add nested property",
            btnAddArray: "Add value",
            btnRemove: "Remove property",
            btnAddProperty: "Add property",
            alertEmptyValueArray: "It is not possible to add an empty value",
            promptNewProperty: "Write key name for the new property",
            alertKeyEmpty: "The key name cannot be an empty text",
            alertKeyDuplicated: 'The key "{keyname}" is duplicated. Please rename your key.',
            alertNestedKeyDuplicated: 'The key "{keyname}" in "{keypath}" is duplicated. Please rename your key.',
            confirmRemoveProperty: "Are you sure that you want to remove the selected property?",
            ...this.opts.textContent,
        };

        // Define icons
        this.icon = {
            dataString:
                '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>',
            dataObject:
                '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px"><g><rect fill="none" height="24" width="24"/></g><g><g><path d="M4,7v2c0,0.55-0.45,1-1,1H2v4h1c0.55,0,1,0.45,1,1v2c0,1.65,1.35,3,3,3h3v-2H7c-0.55,0-1-0.45-1-1v-2 c0-1.3-0.84-2.42-2-2.83v-0.34C5.16,11.42,6,10.3,6,9V7c0-0.55,0.45-1,1-1h3V4H7C5.35,4,4,5.35,4,7z"/><path d="M21,10c-0.55,0-1-0.45-1-1V7c0-1.65-1.35-3-3-3h-3v2h3c0.55,0,1,0.45,1,1v2c0,1.3,0.84,2.42,2,2.83v0.34 c-1.16,0.41-2,1.52-2,2.83v2c0,0.55-0.45,1-1,1h-3v2h3c1.65,0,3-1.35,3-3v-2c0-0.55,0.45-1,1-1h1v-4H21z"/></g></g></svg>',
            dataArray:
                '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px"><g><rect fill="none" height="24" width="24"/></g><g><g><polygon points="15,4 15,6 18,6 18,18 15,18 15,20 20,20 20,4"/><polygon points="4,20 9,20 9,18 6,18 6,6 9,6 9,4 4,4"/></g></g></svg>',
            add: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>',
            nested: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 15l-6 6-1.42-1.42L15.17 16H4V4h2v10h9.17l-3.59-3.58L13 9l6 6z"/></svg>',
            remove: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
            ...this.opts.icons,
        };

        // Run methods to build form
        this.BuildEnviroment();
        this.eachData(userData);

        // Return methods
        return {
            getJSON: () => this.BUILD_JSON(),
        };
    }

    BuildEnviroment() {
        const WrapForm = document.createElement("div");
        const WrapBtnAdd = document.createElement("div");
        const StyleTag = document.createElement("style");

        // Add settings Main Container
        this.Container.classList.add("jsonfields-container");

        // Append Wrap from
        WrapForm.classList.add("jsonfields-contentForm");
        this.ContainerForm = WrapForm;
        this.Container.appendChild(WrapForm);

        // Append Wrap button add element
        WrapBtnAdd.classList.add("jsonfields-addProperty");
        WrapBtnAdd.innerHTML = `<button type="button"></button>`;
        const Btn = WrapBtnAdd.querySelector("button");
        Btn.innerText = this.txt.btnAddProperty;
        Btn.className = this.opts.bootstrapSupport ? "btn btn-success" : "jfBtn-success lg";
        Btn.addEventListener("click", (e) => this.AddProperty(e.currentTarget));
        this.Container.appendChild(WrapBtnAdd);
    }

    // Method that takes care to BUILD NEW PROPERTY. This method just return an element not append.
    BuildElement(key = "", value = "") {
        const txt = this.txt;
        const opts = this.opts;
        const icon = this.icon;
        const Parent = document.createElement("div");
        const InputKey = document.createElement("input");
        const InputValue = {
            wrap: document.createElement("div"),
            input: document.createElement("input"),
        };
        const Radios = {
            wrap: document.createElement("div"),
            default: document.createElement("input"),
            object: document.createElement("input"),
            array: document.createElement("input"),
        };
        const BtnAdd = document.createElement("button");
        const BtnRemove = document.createElement("button");
        const isArray = Array.isArray(value);
        const isObject = typeof value === "object" && !isArray;
        const isDefault = !isArray && !isObject;
        const ID = key + "-" + (Math.random() + 1).toString(36).substring(7);

        // Set Parent or Main Wrap element
        Parent.classList.add("jf-group");
        if (isObject) Parent.classList.add("object-profile");
        if (isArray) Parent.classList.add("array-profile");

        // Set Radio input elements
        Radios.wrap.classList.add("jf-radiosWrap");
        Radios.wrap.innerHTML = `
            <label for="jfDefault${ID}" title="${txt.radioDefaultTitle}">${icon.dataString}</label>
            <label for="jfObject${ID}" title="${txt.radioObjectTitle}">${icon.dataObject}</label>
            <label for="jfArray${ID}" title="${txt.radioArrayTitle}">${icon.dataArray}</label>
            `;
        // Set Radio input Default
        Radios.default.type = "radio";
        Radios.default.value = "default";
        Radios.default.name = "datatype-" + ID;
        Radios.default.id = `jfDefault${ID}`;
        Radios.default.checked = isDefault;
        Radios.wrap.querySelector(`label[for="jfDefault${ID}"]`).insertAdjacentElement("beforebegin", Radios.default);
        // Set Radio Input Object
        Radios.object.type = "radio";
        Radios.object.value = "object";
        Radios.object.name = "datatype-" + ID;
        Radios.object.id = `jfObject${ID}`;
        Radios.object.checked = isObject;
        Radios.wrap.querySelector(`label[for="jfObject${ID}"]`).insertAdjacentElement("beforebegin", Radios.object);
        // Set Radio Input Array
        Radios.array.type = "radio";
        Radios.array.value = "array";
        Radios.array.name = "datatype-" + ID;
        Radios.array.id = `jfArray${ID}`;
        Radios.array.checked = isArray;
        Radios.wrap.querySelector(`label[for="jfArray${ID}"]`).insertAdjacentElement("beforebegin", Radios.array);
        // Set Events for Radios
        [...Radios.wrap.querySelectorAll("input")].forEach((radio) => {
            radio.addEventListener("change", (e) => this.RadiosAction(e));
        });
        // Append Radios
        Parent.appendChild(Radios.wrap);

        // Set Input key
        InputKey.type = "text";
        InputKey.value = key;
        InputKey.name = "key";
        InputKey.placeholder = txt.inputKeyPlaceholder;
        InputKey.classList.add(opts.bootstrapSupport ? "form-control" : "jf-formCtrl");
        Parent.appendChild(InputKey);

        // Set Input value
        InputValue.wrap.classList.add("jfValueContent");
        InputValue.input.classList.add(opts.bootstrapSupport ? "form-control" : "jf-formCtrl");
        InputValue.input.type = "text";
        InputValue.input.name = "value";
        InputValue.input.placeholder = isArray ? txt.inputValueArrayPlaceholder : txt.inputValueObjectPlaceholder;
        InputValue.input.value = isObject || isArray ? "" : value;
        InputValue.input.addEventListener("keydown", (e) => {
            if (Radios.array.checked && e.key === "Enter") this.AddChip(InputValue);
        });
        InputValue.wrap.appendChild(InputValue.input);
        if (isArray) value.forEach((val) => this.AddChip(InputValue, val));
        Parent.appendChild(InputValue.wrap);

        // Set button to Add element
        BtnAdd.type = "button";
        BtnAdd.role = "add";
        BtnAdd.className = opts.bootstrapSupport ? "btn btn-success" : "jfBtn-success";
        BtnAdd.title = isArray ? txt.btnAddArray : txt.btnAddObject;
        BtnAdd.innerHTML = isArray ? icon.add : icon.nested;
        BtnAdd.addEventListener("click", (e) => {
            if (isArray || Radios.array.checked) {
                this.AddChip(InputValue);
            } else {
                this.AddProperty(e.currentTarget, true);
            }
        });
        Parent.appendChild(BtnAdd);

        // Set button to remove element
        BtnRemove.type = "button";
        BtnRemove.role = "remove";
        BtnRemove.className = opts.bootstrapSupport ? "btn btn-danger" : "jfBtn-danger";
        BtnRemove.title = txt.btnRemove;
        BtnRemove.innerHTML = icon.remove;
        BtnRemove.addEventListener("click", (e) => this.RemoveProperty(e.currentTarget));
        Parent.appendChild(BtnRemove);

        return Parent;
    }

    // Method to add chip (push value) in array properties
    AddChip({ wrap, input }, val) {
        let Value = input.value || val;
        Value = typeof Value === "object" ? JSON.stringify(Value) : Value;

        if (!Value) {
            alert(this.txt.alertEmptyValueArray);
            return false;
        }

        const ChipItem = document.createElement("span");
        ChipItem.classList.add("jfChip");
        ChipItem.innerHTML = `<span>${Value}</span> <a>${this.icon.remove}</a>`;

        const InputItem = document.createElement("input");
        InputItem.type = "hidden";
        InputItem.name = "value";
        InputItem.value = Value;

        ChipItem.appendChild(InputItem);
        wrap.appendChild(ChipItem);

        // Add listener to remove selected chip
        ChipItem.querySelector("a").addEventListener("click", (e) => {
            e.preventDefault();
            e.currentTarget.parentNode.remove();
        });

        // Clean input when the new value is added.
        if (!!input.value) input.value = null;
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
        let promptNewKey = prompt(this.txt.promptNewProperty);

        if (!promptNewKey) {
            alert(this.txt.alertKeyEmpty);
        } else {
            promptNewKey = promptNewKey.replace(/[\s\.]/g, "");
            const Parent = Target.parentNode;
            const keypath = isNested ? Parent.dataset.keypath : null;
            const newKeypath = isNested ? `${keypath}.${promptNewKey}` : promptNewKey;

            if (this.hasDuplicateKeys(newKeypath)) {
                if (isNested) {
                    alert(
                        this.txt.alertNestedKeyDuplicated
                            .replace("{keyname}", promptNewKey)
                            .replace("{keypath}", keypath)
                    );
                } else {
                    alert(this.txt.alertKeyDuplicated.replace("{keyname}", promptNewKey));
                }
                this.AddProperty(Target, isNested);
                return false;
            }

            this.AppendElement({
                Element: this.BuildElement(promptNewKey),
                Sibling: isNested ? Parent : false,
                keypath: newKeypath,
            });
        }
    }

    // Method that takes care to remove property in the JSONFIELDS
    RemoveProperty(Target) {
        const confirmRemove = confirm(this.txt.confirmRemoveProperty);
        const Parent = Target.parentNode;
        const radioChecked = Parent.querySelector('input[type="radio"]:checked');

        if (confirmRemove) {
            Parent.remove();
            if (radioChecked.value === "object") this.RemoveOrHideNestedElements(Parent, "remove");
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

    // Method that takes care to handle actions from radios
    RadiosAction(event) {
        const Radio = event.currentTarget;
        const Parent = Radio.closest(".jf-group");
        const Input = Parent.querySelector(".jfValueContent input");
        const BtnAdd = Parent.querySelector("button[role='add']");

        Parent.classList.remove("object-profile", "array-profile");
        BtnAdd.innerHTML = Radio.value === "array" ? this.icon.add : this.icon.nested;

        if (Radio.value === "object") {
            Parent.classList.add("object-profile");
        } else if (Radio.value === "array") {
            Parent.classList.add("array-profile");
            Input.placeholder = this.txt.inputValueArrayPlaceholder;
        } else {
            Input.placeholder = this.txt.inputValueObjectPlaceholder;
        }

        this.RemoveOrHideNestedElements(Parent, Radio.value === "object" ? "show" : "hide");
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

    // Method that takes care to check that there aren't duplicate keys
    hasDuplicateKeys(key) {
        const InputGroups = this.ContainerForm.querySelectorAll("[data-keypath]");
        let keypaths = [...InputGroups].map((Elem) => Elem.dataset.keypath);

        return keypaths.indexOf(key) > -1;
    }

    // Method to sanitizing value to don't have conflict at the moment to append in the JSON
    sanitizeValue(value) {
        value = /\{(.*?)\}/.test(value) ? JSON.parse(value) : value.replace(/"/g, "'");
        value = !!value && !isNaN(+value) ? +value : value;
        value = value === "true" ? true : value === "false" ? false : value;

        return value;
    }

    // Method to build json from the form
    BUILD_JSON() {
        const InputGroups = this.ContainerForm.querySelectorAll("[data-keypath]:not(.hide)");
        var jsonObject = {};

        [...InputGroups].forEach((Elem) => {
            const keypath = Elem.dataset.keypath.split(".");
            const radioChecked = Elem.querySelector('input[type="radio"]:checked').value;
            let value = Elem.querySelector('input[name="value"]').value;

            let currentObj = jsonObject;
            keypath.forEach((key, index) => {
                if (radioChecked === "object" && !currentObj[key]) {
                    currentObj[key] = {};
                } else if (index === keypath.length - 1) {
                    if (radioChecked === "array") {
                        currentObj[key] = [...Elem.querySelectorAll(".jfChip input")].map((El) =>
                            this.sanitizeValue(El.value)
                        );
                    } else {
                        currentObj[key] = this.sanitizeValue(value);
                    }
                } else {
                    currentObj = currentObj[key];
                }
            });
        });

        return jsonObject;
    }
}

export default JSONFIELDS;
