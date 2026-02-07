/**
 * Parametric Modeling (PMG) extension for SketchUp.
 *
 * @copyright © 2021 Samuel Tallet
 *
 * @licence GNU General Public License 3.0
 */

// Translates.
t = string => {

    if (PMGNodesEditorTranslation.hasOwnProperty(string)) {
        return PMGNodesEditorTranslation[string]
    } else {
        return string
    }

}

PMG = {}

PMG.NodesEditor = {}

PMG.NodesEditor.initializeSockets = () => {

    PMG.NodesEditor.sockets = {

        number: new Rete.Socket(t('Number')),
        groups: new Rete.Socket(t('Groups')),
        point: new Rete.Socket(t('Point')),
        vector: new Rete.Socket(t('Vector'))

    }

}

PMG.NodesEditor.initializeSockets()

PMG.Utils = {}

PMG.Utils.cloneObject = object => {
    return JSON.parse(JSON.stringify(object))
}

PMG.Utils.isValidNumber = number => {

    if (typeof number === 'number') {
        return true
    }

    if (typeof number === 'string' && /^-?(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(number)) {
        return true
    }

    return false

}

PMG.NodesEditor.initializeControls = () => {

    PMG.NodesEditor.controls = {}

    PMG.NodesEditor.controls['number'] = {

        props: ['emitter', 'ikey', 'getData', 'putData', 'placeholder', 'readonly'],

        template: '<input type="number" :placeholder="placeholder" :title="placeholder" :readonly="readonly" :value="value" @input="change($event)" @pointerdown.stop="" @pointermove.stop="" />',

        data() {

            return {
                value: ''
            }

        },

        methods: {

            change(event) {

                if (PMG.Utils.isValidNumber(event.target.value)) {

                    this.value = parseFloat(event.target.value)

                    this.update()

                }

            },

            update() {

                this.putData(this.ikey, this.value)

                this.emitter.trigger('process')

            }

        },

        mounted() {

            if (PMG.Utils.isValidNumber(this.getData(this.ikey))) {
                this.value = this.getData(this.ikey)
            }

        }

    }

    PMG.NodesEditor.controls['text'] = {

        props: ['emitter', 'ikey', 'getData', 'putData', 'placeholder', 'title', 'readonly'],

        template: '<input type="text" spellcheck="false" :placeholder="placeholder" :title="title" :readonly="readonly" :value="value" @input="change($event)" @pointerdown.stop="" @pointermove.stop="" />',

        data() {

            return {
                value: ''
            }

        },

        methods: {

            change(event) {

                this.value = event.target.value

                this.update()

            },

            update() {

                this.putData(this.ikey, this.value)

                this.emitter.trigger('process')

            }

        },

        mounted() {
            this.value = this.getData(this.ikey)
        }

    }

    PMG.NodesEditor.controls['textarea'] = {

        props: ['emitter', 'ikey', 'getData', 'putData', 'placeholder'],

        template: '<textarea spellcheck="false" :placeholder="placeholder" @input="change($event)" @pointerdown.stop="" @pointermove.stop="">{{ value }}</textarea>',

        data() {

            return {
                value: ''
            }

        },

        methods: {

            change(event) {

                this.value = event.target.value

                this.update()

            },

            update() {

                this.putData(this.ikey, this.value)

                this.emitter.trigger('process')

            }

        },

        mounted() {
            this.value = this.getData(this.ikey)
        }

    }

    PMG.NodesEditor.controls['checkbox'] = {

        props: ['emitter', 'ikey', 'getData', 'putData', 'label'],

        template:
            `<div class="checkbox-control">
            <input type="checkbox" @change="change($event)" :checked="checked" />
            {{ label }}
        </div>`,

        data() {

            return {
                checked: this.getData(this.ikey),
                label: this.label
            }

        },

        methods: {

            change(event) {

                this.checked = event.target.checked

                this.update()

            },

            update() {

                this.putData(this.ikey, this.checked)

                this.emitter.trigger('process')

            }

        },

        mounted() {
            this.checked = this.getData(this.ikey)
        }

    }

    PMG.NodesEditor.controls['material'] = {

        props: ['emitter', 'ikey', 'getData', 'putData'],

        template:
            `<select @change="change($event)">
            <option value="">${t('Material...')}</option>
            <option v-for="material in materials" v-bind:value="material.name" v-bind:selected="material.selected">
                {{ material.display_name }}
            </option>
        </select>`,

        data() {

            var nodeSelectedMaterial = this.getData(this.ikey)
            var nodeSelectableMaterials = PMG.Utils.cloneObject(SketchUpMaterials)

            nodeSelectableMaterials.forEach(nodeSelectableMaterial => {

                if (nodeSelectableMaterial.name == nodeSelectedMaterial) {
                    nodeSelectableMaterial.selected = 'selected'
                } else {
                    nodeSelectableMaterial.selected = ''
                }

            })

            return {
                materials: nodeSelectableMaterials
            }

        },

        methods: {

            change(event) {

                this.value = event.target.value

                this.update()

            },

            update() {

                this.putData(this.ikey, this.value)

                this.emitter.trigger('process')

            }

        },

        mounted() {
            this.value = this.getData(this.ikey)
        }

    }

    PMG.NodesEditor.controls['layer'] = {

        props: ['emitter', 'ikey', 'getData', 'putData'],

        template:
            `<select @change="change($event)">
            <option value="">${t('Tag/Layer...')}</option>
            <option v-for="layer in layers" v-bind:value="layer.name" v-bind:selected="layer.selected">
                {{ layer.display_name }}
            </option>
        </select>`,

        data() {

            var nodeSelectedLayer = this.getData(this.ikey)
            var nodeSelectableLayers = PMG.Utils.cloneObject(SketchUpLayers)

            nodeSelectableLayers.forEach(nodeSelectableLayer => {

                if (nodeSelectableLayer.name == nodeSelectedLayer) {
                    nodeSelectableLayer.selected = 'selected'
                } else {
                    nodeSelectableLayer.selected = ''
                }

            })

            return {
                layers: nodeSelectableLayers
            }

        },

        methods: {

            change(event) {

                this.value = event.target.value

                this.update()

            },

            update() {

                this.putData(this.ikey, this.value)

                this.emitter.trigger('process')

            }

        },

        mounted() {
            this.value = this.getData(this.ikey)
        }

    }

}

PMG.NodesEditor.initializeControls()

class NumberReteControl extends Rete.Control {

    constructor(emitter, ikey, placeholder, readonly) {

        super(ikey)
        this.component = PMG.NodesEditor.controls.number
        this.props = { emitter, ikey, placeholder, readonly }

    }

    setValue(value) {
        this.vueContext.value = value
    }

}

class TextReteControl extends Rete.Control {

    constructor(emitter, ikey, placeholder, title, readonly) {

        super(ikey)
        this.component = PMG.NodesEditor.controls.text
        this.props = { emitter, ikey, placeholder, title, readonly }

    }

    setValue(value) {
        this.vueContext.value = value
    }

}

class TextAreaReteControl extends Rete.Control {

    constructor(emitter, ikey, placeholder) {

        super(ikey)
        this.component = PMG.NodesEditor.controls.textarea
        this.props = { emitter, ikey, placeholder }

    }

    setValue(value) {
        this.vueContext.value = value
    }

}

class CheckBoxReteControl extends Rete.Control {

    constructor(emitter, ikey, label) {

        super(ikey)
        this.component = PMG.NodesEditor.controls.checkbox
        this.props = { emitter, ikey, label }

    }

    setValue(checked) {
        this.vueContext.checked = checked
    }

}

class MaterialReteControl extends Rete.Control {

    constructor(emitter, ikey) {

        super(ikey)
        this.component = PMG.NodesEditor.controls.material
        this.props = { emitter, ikey }

    }

    setValue(value) {
        this.vueContext.value = value
    }

}

class LayerReteControl extends Rete.Control {

    constructor(emitter, ikey) {

        super(ikey)
        this.component = PMG.NodesEditor.controls.layer
        this.props = { emitter, ikey }

    }

    setValue(value) {
        this.vueContext.value = value
    }

}

class DrawBoxReteComponent extends Rete.Component {

    constructor() {
        super('Draw box')
    }

    builder(node) {

        var width = new Rete.Input('width', t('Width'), PMG.NodesEditor.sockets.number)
        width.addControl(new NumberReteControl(this.editor, 'width', t('Width')))

        var depth = new Rete.Input('depth', t('Depth'), PMG.NodesEditor.sockets.number)
        depth.addControl(new NumberReteControl(this.editor, 'depth', t('Depth')))

        var height = new Rete.Input('height', t('Height'), PMG.NodesEditor.sockets.number)
        height.addControl(new NumberReteControl(this.editor, 'height', t('Height')))

        var group = new Rete.Output('groups', t('Group'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(width)
            .addInput(depth)
            .addInput(height)
            .addControl(new TextReteControl(this.editor, 'name', t('Name')))
            .addControl(new MaterialReteControl(this.editor, 'material'))
            .addControl(new LayerReteControl(this.editor, 'layer'))
            .addOutput(group)

    }

    worker(_node, _inputs, _outputs) { }

}

class DrawPrismReteComponent extends Rete.Component {

    constructor() {
        super('Draw prism')
    }

    builder(node) {

        var radius = new Rete.Input('radius', t('Radius'), PMG.NodesEditor.sockets.number)
        radius.addControl(new NumberReteControl(this.editor, 'radius', t('Radius')))

        var height = new Rete.Input('height', t('Height'), PMG.NodesEditor.sockets.number)
        height.addControl(new NumberReteControl(this.editor, 'height', t('Height')))

        var sides = new Rete.Input('sides', t('Sides'), PMG.NodesEditor.sockets.number)
        sides.addControl(new NumberReteControl(this.editor, 'sides', t('Sides')))

        var group = new Rete.Output('groups', t('Group'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(radius)
            .addInput(height)
            .addInput(sides)
            .addControl(new TextReteControl(this.editor, 'name', t('Name')))
            .addControl(new MaterialReteControl(this.editor, 'material'))
            .addControl(new LayerReteControl(this.editor, 'layer'))
            .addOutput(group)

    }

    worker(_node, _inputs, _outputs) { }

}

class DrawCylinderReteComponent extends Rete.Component {

    constructor() {
        super('Draw cylinder')
    }

    builder(node) {

        var radius = new Rete.Input('radius', t('Radius'), PMG.NodesEditor.sockets.number)
        radius.addControl(new NumberReteControl(this.editor, 'radius', t('Radius')))

        var height = new Rete.Input('height', t('Height'), PMG.NodesEditor.sockets.number)
        height.addControl(new NumberReteControl(this.editor, 'height', t('Height')))

        var segments = new Rete.Input('segments', t('Segments'), PMG.NodesEditor.sockets.number)
        segments.addControl(new NumberReteControl(this.editor, 'segments', t('Segments')))

        var group = new Rete.Output('groups', t('Group'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(radius)
            .addInput(height)
            .addInput(segments)
            .addControl(new TextReteControl(this.editor, 'name', t('Name')))
            .addControl(new MaterialReteControl(this.editor, 'material'))
            .addControl(new LayerReteControl(this.editor, 'layer'))
            .addOutput(group)

    }

    worker(_node, _inputs, _outputs) { }

}

class DrawTubeReteComponent extends Rete.Component {

    constructor() {
        super('Draw tube')
    }

    builder(node) {

        var radius = new Rete.Input('radius', t('Radius'), PMG.NodesEditor.sockets.number)
        radius.addControl(new NumberReteControl(this.editor, 'radius', t('Radius')))

        var thickness = new Rete.Input('thickness', t('Thickness'), PMG.NodesEditor.sockets.number)
        thickness.addControl(new NumberReteControl(this.editor, 'thickness', t('Thickness')))

        var height = new Rete.Input('height', t('Height'), PMG.NodesEditor.sockets.number)
        height.addControl(new NumberReteControl(this.editor, 'height', t('Height')))

        var segments = new Rete.Input('segments', t('Segments'), PMG.NodesEditor.sockets.number)
        segments.addControl(new NumberReteControl(this.editor, 'segments', t('Segments')))

        var group = new Rete.Output('groups', t('Group'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(radius)
            .addInput(thickness)
            .addInput(height)
            .addInput(segments)
            .addControl(new TextReteControl(this.editor, 'name', t('Name')))
            .addControl(new MaterialReteControl(this.editor, 'material'))
            .addControl(new LayerReteControl(this.editor, 'layer'))
            .addOutput(group)

    }

    worker(_node, _inputs, _outputs) { }

}

class DrawPyramidReteComponent extends Rete.Component {

    constructor() {
        super('Draw pyramid')
    }

    builder(node) {

        var radius = new Rete.Input('radius', t('Radius'), PMG.NodesEditor.sockets.number)
        radius.addControl(new NumberReteControl(this.editor, 'radius', t('Radius')))

        var height = new Rete.Input('height', t('Height'), PMG.NodesEditor.sockets.number)
        height.addControl(new NumberReteControl(this.editor, 'height', t('Height')))

        var sides = new Rete.Input('sides', t('Sides'), PMG.NodesEditor.sockets.number)
        sides.addControl(new NumberReteControl(this.editor, 'sides', t('Sides')))

        var group = new Rete.Output('groups', t('Group'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(radius)
            .addInput(height)
            .addInput(sides)
            .addControl(new TextReteControl(this.editor, 'name', t('Name')))
            .addControl(new MaterialReteControl(this.editor, 'material'))
            .addControl(new LayerReteControl(this.editor, 'layer'))
            .addOutput(group)

    }

    worker(_node, _inputs, _outputs) { }

}

class DrawConeReteComponent extends Rete.Component {

    constructor() {
        super('Draw cone')
    }

    builder(node) {

        var radius = new Rete.Input('radius', t('Radius'), PMG.NodesEditor.sockets.number)
        radius.addControl(new NumberReteControl(this.editor, 'radius', t('Radius')))

        var height = new Rete.Input('height', t('Height'), PMG.NodesEditor.sockets.number)
        height.addControl(new NumberReteControl(this.editor, 'height', t('Height')))

        var segments = new Rete.Input('segments', t('Segments'), PMG.NodesEditor.sockets.number)
        segments.addControl(new NumberReteControl(this.editor, 'segments', t('Segments')))

        var group = new Rete.Output('groups', t('Group'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(radius)
            .addInput(height)
            .addInput(segments)
            .addControl(new TextReteControl(this.editor, 'name', t('Name')))
            .addControl(new MaterialReteControl(this.editor, 'material'))
            .addControl(new LayerReteControl(this.editor, 'layer'))
            .addOutput(group)

    }

    worker(_node, _inputs, _outputs) { }

}

class DrawSphereReteComponent extends Rete.Component {

    constructor() {
        super('Draw sphere')
    }

    builder(node) {

        var radius = new Rete.Input('radius', t('Radius'), PMG.NodesEditor.sockets.number)
        radius.addControl(new NumberReteControl(this.editor, 'radius', t('Radius')))

        var segments = new Rete.Input('segments', t('Segments'), PMG.NodesEditor.sockets.number)
        segments.addControl(new NumberReteControl(this.editor, 'segments', t('Segments')))

        var group = new Rete.Output('groups', t('Group'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(radius)
            .addInput(segments)
            .addControl(new TextReteControl(this.editor, 'name', t('Name')))
            .addControl(new MaterialReteControl(this.editor, 'material'))
            .addControl(new LayerReteControl(this.editor, 'layer'))
            .addOutput(group)

    }

    worker(_node, _inputs, _outputs) { }

}

class DrawShapeReteComponent extends Rete.Component {

    constructor() {
        super('Draw shape')
    }

    builder(node) {

        var group = new Rete.Output('groups', t('Group'), PMG.NodesEditor.sockets.groups)

        return node
            .addControl(new TextReteControl(this.editor, 'name', t('Name')))
            .addControl(new MaterialReteControl(this.editor, 'material'))
            .addControl(new LayerReteControl(this.editor, 'layer'))
            .addOutput(group)

    }

    worker(_node, _inputs, _outputs) { }

}

class NumberReteComponent extends Rete.Component {

    constructor() {
        super('Number')
    }

    builder(node) {

        var number = new Rete.Output('number', t('Number'), PMG.NodesEditor.sockets.number)

        return node
            .addControl(new TextReteControl(this.editor, 'label', t('Label')))
            .addControl(new NumberReteControl(this.editor, 'number'))
            .addOutput(number)

    }

    worker(node, _inputs, outputs) {
        outputs['number'] = PMG.Utils.isValidNumber(node.data.number) ? node.data.number : 0
    }

}

class AddReteComponent extends Rete.Component {

    constructor() {
        super('Add')
    }

    builder(node) {

        var inputNumber1 = new Rete.Input('number1', t('Number'), PMG.NodesEditor.sockets.number)
        inputNumber1.addControl(new NumberReteControl(this.editor, 'number1'))

        var inputNumber2 = new Rete.Input('number2', t('Number'), PMG.NodesEditor.sockets.number)
        inputNumber2.addControl(new NumberReteControl(this.editor, 'number2'))

        var outputNumber = new Rete.Output('number', t('Number'), PMG.NodesEditor.sockets.number)

        return node
            .addInput(inputNumber1)
            .addInput(inputNumber2)
            .addControl(new NumberReteControl(this.editor, 'preview', '', true))
            .addOutput(outputNumber)

    }

    worker(node, inputs, outputs) {

        var number1 = inputs['number1'].length ? inputs['number1'][0] : node.data.number1
        var number2 = inputs['number2'].length ? inputs['number2'][0] : node.data.number2

        if (PMG.Utils.isValidNumber(number1)) {
            number1 = parseFloat(number1)
        } else {
            number1 = 0
        }

        if (PMG.Utils.isValidNumber(number2)) {
            number2 = parseFloat(number2)
        } else {
            number2 = 0
        }

        var sum = number1 + number2
        sum = Math.round((sum + Number.EPSILON) * 1000000) / 1000000

        this.editor.nodes.find(n => n.id == node.id).controls.get('preview').setValue(sum)
        outputs['number'] = sum

    }

}

class SubtractReteComponent extends Rete.Component {

    constructor() {
        super('Subtract')
    }

    builder(node) {

        var inputNumber1 = new Rete.Input('number1', t('Number'), PMG.NodesEditor.sockets.number)
        inputNumber1.addControl(new NumberReteControl(this.editor, 'number1'))

        var inputNumber2 = new Rete.Input('number2', t('Number'), PMG.NodesEditor.sockets.number)
        inputNumber2.addControl(new NumberReteControl(this.editor, 'number2'))

        var outputNumber = new Rete.Output('number', t('Number'), PMG.NodesEditor.sockets.number)

        return node
            .addInput(inputNumber1)
            .addInput(inputNumber2)
            .addControl(new NumberReteControl(this.editor, 'preview', '', true))
            .addOutput(outputNumber)

    }

    worker(node, inputs, outputs) {

        var number1 = inputs['number1'].length ? inputs['number1'][0] : node.data.number1
        var number2 = inputs['number2'].length ? inputs['number2'][0] : node.data.number2

        if (PMG.Utils.isValidNumber(number1)) {
            number1 = parseFloat(number1)
        } else {
            number1 = 0
        }

        if (PMG.Utils.isValidNumber(number2)) {
            number2 = parseFloat(number2)
        } else {
            number2 = 0
        }

        var diff = number1 - number2
        diff = Math.round((diff + Number.EPSILON) * 1000000) / 1000000

        this.editor.nodes.find(n => n.id == node.id).controls.get('preview').setValue(diff)
        outputs['number'] = diff

    }

}

class MultiplyReteComponent extends Rete.Component {

    constructor() {
        super('Multiply')
    }

    builder(node) {

        var inputNumber1 = new Rete.Input('number1', t('Number'), PMG.NodesEditor.sockets.number)
        inputNumber1.addControl(new NumberReteControl(this.editor, 'number1'))

        var inputNumber2 = new Rete.Input('number2', t('Number'), PMG.NodesEditor.sockets.number)
        inputNumber2.addControl(new NumberReteControl(this.editor, 'number2'))

        var outputNumber = new Rete.Output('number', t('Number'), PMG.NodesEditor.sockets.number)

        return node
            .addInput(inputNumber1)
            .addInput(inputNumber2)
            .addControl(new NumberReteControl(this.editor, 'preview', '', true))
            .addOutput(outputNumber)

    }

    worker(node, inputs, outputs) {

        var number1 = inputs['number1'].length ? inputs['number1'][0] : node.data.number1
        var number2 = inputs['number2'].length ? inputs['number2'][0] : node.data.number2

        if (PMG.Utils.isValidNumber(number1)) {
            number1 = parseFloat(number1)
        } else {
            number1 = 0
        }

        if (PMG.Utils.isValidNumber(number2)) {
            number2 = parseFloat(number2)
        } else {
            number2 = 0
        }

        var product = number1 * number2

        this.editor.nodes.find(n => n.id == node.id).controls.get('preview').setValue(product)
        outputs['number'] = product

    }

}

class DivideReteComponent extends Rete.Component {

    constructor() {
        super('Divide')
    }

    builder(node) {

        var dividend = new Rete.Input('dividend', t('Dividend'), PMG.NodesEditor.sockets.number)
        dividend.addControl(new NumberReteControl(this.editor, 'dividend', t('Dividend')))

        var divisor = new Rete.Input('divisor', t('Divisor'), PMG.NodesEditor.sockets.number)
        divisor.addControl(new NumberReteControl(this.editor, 'divisor', t('Divisor')))

        var quotient = new Rete.Output('quotient', t('Quotient'), PMG.NodesEditor.sockets.number)
        var remainder = new Rete.Output('remainder', t('Remainder'), PMG.NodesEditor.sockets.number)

        return node
            .addInput(dividend)
            .addInput(divisor)
            .addControl(new NumberReteControl(this.editor, 'preview', '', true))
            .addOutput(quotient)
            .addOutput(remainder)

    }

    worker(node, inputs, outputs) {

        var dividend = inputs['dividend'].length ? inputs['dividend'][0] : node.data.dividend
        var divisor = inputs['divisor'].length ? inputs['divisor'][0] : node.data.divisor

        if (PMG.Utils.isValidNumber(dividend)) {
            dividend = parseFloat(dividend)
        } else {
            dividend = 0
        }

        if (PMG.Utils.isValidNumber(divisor)) {
            divisor = parseFloat(divisor)
        } else {
            divisor = 1
        }

        var quotient = dividend / divisor
        var remainder = dividend % divisor

        this.editor.nodes.find(n => n.id == node.id).controls.get('preview').setValue(quotient)
        outputs['quotient'] = quotient
        outputs['remainder'] = remainder

    }

}

PMG.Utils.degrees2radians = angle => {
    return angle * (Math.PI / 180)
}

class CalculateReteComponent extends Rete.Component {

    constructor() {
        super('Calculate')
    }

    builder(node) {

        var inputA = new Rete.Input('a', t('Variable A'), PMG.NodesEditor.sockets.number)
        inputA.addControl(new NumberReteControl(this.editor, 'a', t('Variable A')))

        var inputB = new Rete.Input('b', t('Variable B'), PMG.NodesEditor.sockets.number)
        inputB.addControl(new NumberReteControl(this.editor, 'b', t('Variable B')))

        var inputC = new Rete.Input('c', t('Variable C'), PMG.NodesEditor.sockets.number)
        inputC.addControl(new NumberReteControl(this.editor, 'c', t('Variable C')))

        var inputD = new Rete.Input('d', t('Variable D'), PMG.NodesEditor.sockets.number)
        inputD.addControl(new NumberReteControl(this.editor, 'd', t('Variable D')))

        var inputE = new Rete.Input('e', t('Variable E'), PMG.NodesEditor.sockets.number)
        inputE.addControl(new NumberReteControl(this.editor, 'e', t('Variable E')))

        var inputF = new Rete.Input('f', t('Variable F'), PMG.NodesEditor.sockets.number)
        inputF.addControl(new NumberReteControl(this.editor, 'f', t('Variable F')))

        var inputG = new Rete.Input('g', t('Variable G'), PMG.NodesEditor.sockets.number)
        inputG.addControl(new NumberReteControl(this.editor, 'g', t('Variable G')))

        var inputH = new Rete.Input('h', t('Variable H'), PMG.NodesEditor.sockets.number)
        inputH.addControl(new NumberReteControl(this.editor, 'h', t('Variable H')))

        var inputI = new Rete.Input('i', t('Variable I'), PMG.NodesEditor.sockets.number)
        inputI.addControl(new NumberReteControl(this.editor, 'i', t('Variable I')))

        var inputJ = new Rete.Input('j', t('Variable J'), PMG.NodesEditor.sockets.number)
        inputJ.addControl(new NumberReteControl(this.editor, 'j', t('Variable J')))

        var inputK = new Rete.Input('k', t('Variable K'), PMG.NodesEditor.sockets.number)
        inputK.addControl(new NumberReteControl(this.editor, 'k', t('Variable K')))

        var inputL = new Rete.Input('l', t('Variable L'), PMG.NodesEditor.sockets.number)
        inputL.addControl(new NumberReteControl(this.editor, 'l', t('Variable L')))

        var outputNumber = new Rete.Output('number', t('Number'), PMG.NodesEditor.sockets.number)

        return node
            .addControl(new TextReteControl(this.editor, 'formula', t('Formula example:') + ' round(a) * b'))
            .addInput(inputA)
            .addInput(inputB)
            .addInput(inputC)
            .addInput(inputD)
            .addInput(inputE)
            .addInput(inputF)
            .addInput(inputG)
            .addInput(inputH)
            .addInput(inputI)
            .addInput(inputJ)
            .addInput(inputK)
            .addInput(inputL)
            .addOutput(outputNumber)

    }

    worker(node, inputs, outputs) {

        if (node.data.formula === undefined) {

            outputs['number'] = 0
            return

        }

        var a = inputs['a'].length ? inputs['a'][0] : node.data.a
        var b = inputs['b'].length ? inputs['b'][0] : node.data.b
        var c = inputs['c'].length ? inputs['c'][0] : node.data.c
        var d = inputs['d'].length ? inputs['d'][0] : node.data.d
        var e = inputs['e'].length ? inputs['e'][0] : node.data.e
        var f = inputs['f'].length ? inputs['f'][0] : node.data.f
        var g = inputs['g'].length ? inputs['g'][0] : node.data.g
        var h = inputs['h'].length ? inputs['h'][0] : node.data.h
        var i = inputs['i'].length ? inputs['i'][0] : node.data.i
        var j = inputs['j'].length ? inputs['j'][0] : node.data.j
        var k = inputs['k'].length ? inputs['k'][0] : node.data.k
        var l = inputs['l'].length ? inputs['l'][0] : node.data.l
        var pi = Math.PI

        a = PMG.Utils.isValidNumber(a) ? a : 0
        b = PMG.Utils.isValidNumber(b) ? b : 0
        c = PMG.Utils.isValidNumber(c) ? c : 0
        d = PMG.Utils.isValidNumber(d) ? d : 0
        e = PMG.Utils.isValidNumber(e) ? e : 0
        f = PMG.Utils.isValidNumber(f) ? f : 0
        g = PMG.Utils.isValidNumber(g) ? g : 0
        h = PMG.Utils.isValidNumber(h) ? h : 0
        i = PMG.Utils.isValidNumber(i) ? i : 0
        j = PMG.Utils.isValidNumber(j) ? j : 0
        k = PMG.Utils.isValidNumber(k) ? k : 0
        l = PMG.Utils.isValidNumber(l) ? l : 0

        var fixed_formula = node.data.formula
            .replace(/min/g, 'Math.min')
            .replace(/max/g, 'Math.max')
            .replace(/round/g, 'Math.round')
            .replace(/ceil/g, 'Math.ceil')
            .replace(/floor/g, 'Math.floor')
            .replace(/deg/g, 'PMG.Utils.degrees2radians')
            .replace(/asinh/g, 'Math.asinh')
            .replace(/asin/g, 'Math.asin')
            .replace(/sin/g, 'Math.sin')
            .replace(/acosh/g, 'Math.acosh')
            .replace(/acos/g, 'Math.acos')
            .replace(/cos/g, 'Math.cos')
            .replace(/atanh/g, 'Math.atanh')
            .replace(/atan/g, 'Math.atan')
            .replace(/tan/g, 'Math.tan')
            .replace(/exp/g, 'Math.exp')
            .replace(/log2/g, 'Math.log2')
            .replace(/log10/g, 'Math.log10')
            .replace(/sqrt/g, 'Math.sqrt')
            .replace(/cbrt/g, 'Math.cbrt')

        outputs['number'] = eval(fixed_formula)

    }

}

class PointReteComponent extends Rete.Component {

    constructor() {
        super('Point')
    }

    builder(node) {

        var inputParentPoint = new Rete.Input('parent_point', t('Parent point'), PMG.NodesEditor.sockets.point)

        var inputPointX = new Rete.Input('x', 'X', PMG.NodesEditor.sockets.number)
        inputPointX.addControl(new NumberReteControl(this.editor, 'x', 'X'))

        var inputPointY = new Rete.Input('y', 'Y', PMG.NodesEditor.sockets.number)
        inputPointY.addControl(new NumberReteControl(this.editor, 'y', 'Y'))

        var inputPointZ = new Rete.Input('z', 'Z', PMG.NodesEditor.sockets.number)
        inputPointZ.addControl(new NumberReteControl(this.editor, 'z', 'Z'))

        var outputPoint = new Rete.Output('point', t('Point'), PMG.NodesEditor.sockets.point)

        return node
            .addInput(inputParentPoint)
            .addInput(inputPointX)
            .addInput(inputPointY)
            .addInput(inputPointZ)
            .addControl(new CheckBoxReteControl(this.editor, 'increment_inherited_xyz', t('Increment inherited XYZ')))
            .addOutput(outputPoint)

    }

    worker(_node, _inputs, _outputs) { }

}

class GetPointsReteComponent extends Rete.Component {

    constructor() {
        super('Get points')
    }

    builder(node) {

        var inputGroup = new Rete.Input('groups', t('Group'), PMG.NodesEditor.sockets.groups)

        var outputGroup = new Rete.Output('groups', t('Group'), PMG.NodesEditor.sockets.groups)

        var outputFrontBottomLeft = new Rete.Output('front_bottom_left', t('Front bottom left'), PMG.NodesEditor.sockets.point)
        var outputFrontBottomCenter = new Rete.Output('front_bottom_center', t('Front bottom center'), PMG.NodesEditor.sockets.point)
        var outputFrontBottomRight = new Rete.Output('front_bottom_right', t('Front bottom right'), PMG.NodesEditor.sockets.point)
        var outputFrontCenter = new Rete.Output('front_center', t('Front center'), PMG.NodesEditor.sockets.point)
        var outputFrontTopLeft = new Rete.Output('front_top_left', t('Front top left'), PMG.NodesEditor.sockets.point)
        var outputFrontTopCenter = new Rete.Output('front_top_center', t('Front top center'), PMG.NodesEditor.sockets.point)
        var outputFrontTopRight = new Rete.Output('front_top_right', t('Front top right'), PMG.NodesEditor.sockets.point)

        var outputBottomCenter = new Rete.Output('bottom_center', t('Bottom center'), PMG.NodesEditor.sockets.point)

        var outputLeftBottomCenter = new Rete.Output('left_bottom_center', t('Left bottom center'), PMG.NodesEditor.sockets.point)
        var outputLeftCenter = new Rete.Output('left_center', t('Left center'), PMG.NodesEditor.sockets.point)
        var outputLeftTopCenter = new Rete.Output('left_top_center', t('Left top center'), PMG.NodesEditor.sockets.point)

        var outputCenter = new Rete.Output('center', t('Center'), PMG.NodesEditor.sockets.point)

        var outputRightBottomCenter = new Rete.Output('right_bottom_center', t('Right bottom center'), PMG.NodesEditor.sockets.point)
        var outputRightCenter = new Rete.Output('right_center', t('Right center'), PMG.NodesEditor.sockets.point)
        var outputRightTopCenter = new Rete.Output('right_top_center', t('Right top center'), PMG.NodesEditor.sockets.point)

        var outputTopCenter = new Rete.Output('top_center', t('Top center'), PMG.NodesEditor.sockets.point)

        var outputBackBottomLeft = new Rete.Output('back_bottom_left', t('Back bottom left'), PMG.NodesEditor.sockets.point)
        var outputBackBottomCenter = new Rete.Output('back_bottom_center', t('Back bottom center'), PMG.NodesEditor.sockets.point)
        var outputBackBottomRight = new Rete.Output('back_bottom_right', t('Back bottom right'), PMG.NodesEditor.sockets.point)
        var outputBackCenter = new Rete.Output('back_center', t('Back center'), PMG.NodesEditor.sockets.point)
        var outputBackTopLeft = new Rete.Output('back_top_left', t('Back top left'), PMG.NodesEditor.sockets.point)
        var outputBackTopCenter = new Rete.Output('back_top_center', t('Back top center'), PMG.NodesEditor.sockets.point)
        var outputBackTopRight = new Rete.Output('back_top_right', t('Back top right'), PMG.NodesEditor.sockets.point)

        return node
            .addInput(inputGroup)
            .addOutput(outputGroup)
            .addOutput(outputFrontBottomLeft)
            .addOutput(outputFrontBottomCenter)
            .addOutput(outputFrontBottomRight)
            .addOutput(outputFrontCenter)
            .addOutput(outputFrontTopLeft)
            .addOutput(outputFrontTopCenter)
            .addOutput(outputFrontTopRight)
            .addOutput(outputBottomCenter)
            .addOutput(outputLeftBottomCenter)
            .addOutput(outputLeftCenter)
            .addOutput(outputLeftTopCenter)
            .addOutput(outputCenter)
            .addOutput(outputRightBottomCenter)
            .addOutput(outputRightCenter)
            .addOutput(outputRightTopCenter)
            .addOutput(outputTopCenter)
            .addOutput(outputBackBottomLeft)
            .addOutput(outputBackBottomCenter)
            .addOutput(outputBackBottomRight)
            .addOutput(outputBackCenter)
            .addOutput(outputBackTopLeft)
            .addOutput(outputBackTopCenter)
            .addOutput(outputBackTopRight)

    }

    worker(_node, _inputs, _outputs) { }

}

class VectorReteComponent extends Rete.Component {

    constructor() {
        super('Vector')
    }

    builder(node) {

        var inputVectorX = new Rete.Input('x', 'X', PMG.NodesEditor.sockets.number)
        inputVectorX.addControl(new NumberReteControl(this.editor, 'x', 'X'))

        var inputVectorY = new Rete.Input('y', 'Y', PMG.NodesEditor.sockets.number)
        inputVectorY.addControl(new NumberReteControl(this.editor, 'y', 'Y'))

        var inputVectorZ = new Rete.Input('z', 'Z', PMG.NodesEditor.sockets.number)
        inputVectorZ.addControl(new NumberReteControl(this.editor, 'z', 'Z'))

        var outputVector = new Rete.Output('vector', t('Vector'), PMG.NodesEditor.sockets.vector)

        return node
            .addInput(inputVectorX)
            .addInput(inputVectorY)
            .addInput(inputVectorZ)
            .addOutput(outputVector)

    }

    worker(_node, _inputs, _outputs) { }

}

class IntersectSolidsReteComponent extends Rete.Component {

    constructor() {
        super('Intersect solids')
    }

    builder(node) {

        var inputGroups1 = new Rete.Input('groups1', t('Group'), PMG.NodesEditor.sockets.groups)
        var inputGroups2 = new Rete.Input('groups2', t('Group'), PMG.NodesEditor.sockets.groups)

        var outputGroups = new Rete.Output('groups', t('Group'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(inputGroups1)
            .addInput(inputGroups2)
            .addOutput(outputGroups)

    }

    worker(_node, _inputs, _outputs) { }

}

class UniteSolidsReteComponent extends Rete.Component {

    constructor() {
        super('Unite solids')
    }

    builder(node) {

        var inputGroups1 = new Rete.Input('groups1', t('Group'), PMG.NodesEditor.sockets.groups)
        var inputGroups2 = new Rete.Input('groups2', t('Group'), PMG.NodesEditor.sockets.groups)

        var outputGroups = new Rete.Output('groups', t('Group'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(inputGroups1)
            .addInput(inputGroups2)
            .addOutput(outputGroups)

    }

    worker(_node, _inputs, _outputs) { }

}

class SubtractSolidsReteComponent extends Rete.Component {

    constructor() {
        super('Subtract solids')
    }

    builder(node) {

        var inputGroups1 = new Rete.Input('groups1', t('Group'), PMG.NodesEditor.sockets.groups)
        var inputGroups2 = new Rete.Input('groups2', t('Group'), PMG.NodesEditor.sockets.groups)

        var outputGroups = new Rete.Output('groups', t('Group'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(inputGroups1)
            .addInput(inputGroups2)
            .addOutput(outputGroups)

    }

    worker(_node, _inputs, _outputs) { }

}

class PushPullReteComponent extends Rete.Component {

    constructor() {
        super('Push/Pull')
    }

    builder(node) {

        var inputGroups = new Rete.Input('groups', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputDistance = new Rete.Input('distance', t('Distance'), PMG.NodesEditor.sockets.number)
        inputDistance.addControl(new NumberReteControl(this.editor, 'distance', t('Distance')))
        var inputDirection = new Rete.Input('direction', t('Direction'), PMG.NodesEditor.sockets.vector)

        var outputGroups = new Rete.Output('groups', t('Groups'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(inputGroups)
            .addInput(inputDistance)
            .addControl(new CheckBoxReteControl(this.editor, 'increment_distance', t('Increment distance')))
            .addInput(inputDirection)
            .addOutput(outputGroups)

    }

    worker(_node, _inputs, _outputs) { }

}

class MoveReteComponent extends Rete.Component {

    constructor() {
        super('Move')
    }

    builder(node) {

        var inputGroups = new Rete.Input('groups', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputPosition = new Rete.Input('point', t('Position'), PMG.NodesEditor.sockets.point)

        var inputA = new Rete.Input('a', t('Variable A'), PMG.NodesEditor.sockets.number)
        inputA.addControl(new NumberReteControl(this.editor, 'a', t('Variable A')))

        var inputB = new Rete.Input('b', t('Variable B'), PMG.NodesEditor.sockets.number)
        inputB.addControl(new NumberReteControl(this.editor, 'b', t('Variable B')))

        var inputC = new Rete.Input('c', t('Variable C'), PMG.NodesEditor.sockets.number)
        inputC.addControl(new NumberReteControl(this.editor, 'c', t('Variable C')))

        var inputD = new Rete.Input('d', t('Variable D'), PMG.NodesEditor.sockets.number)
        inputD.addControl(new NumberReteControl(this.editor, 'd', t('Variable D')))

        var inputE = new Rete.Input('e', t('Variable E'), PMG.NodesEditor.sockets.number)
        inputE.addControl(new NumberReteControl(this.editor, 'e', t('Variable E')))

        var inputF = new Rete.Input('f', t('Variable F'), PMG.NodesEditor.sockets.number)
        inputF.addControl(new NumberReteControl(this.editor, 'f', t('Variable F')))

        var outputGroups = new Rete.Output('groups', t('Groups'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(inputGroups)
            .addInput(inputPosition)
            .addInput(inputA)
            .addInput(inputB)
            .addInput(inputC)
            .addInput(inputD)
            .addInput(inputE)
            .addInput(inputF)
            .addControl(new TextReteControl(this.editor, 'x_position', t('X position. Example:') + ' nth * a', t('X position')))
            .addControl(new TextReteControl(this.editor, 'y_position', t('Y position. Example:') + ' nth * b', t('Y position')))
            .addControl(new TextReteControl(this.editor, 'z_position', t('Z position. Example:') + ' nth * c', t('Z position')))
            .addControl(new CheckBoxReteControl(this.editor, 'point_is_absolute', t('Position is absolute')))
            .addOutput(outputGroups)

    }

    worker(_node, _inputs, _outputs) { }

}

class AlignReteComponent extends Rete.Component {

    constructor() {
        super('Align')
    }

    builder(node) {

        var inputGroup = new Rete.Input('groups', t('Group'), PMG.NodesEditor.sockets.groups)
        var inputOrigin = new Rete.Input('origin', t('Origin'), PMG.NodesEditor.sockets.point)
        var inputTarget = new Rete.Input('target', t('Target'), PMG.NodesEditor.sockets.point)

        var outputGroup = new Rete.Output('groups', t('Group'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(inputGroup)
            .addInput(inputOrigin)
            .addInput(inputTarget)
            .addOutput(outputGroup)

    }

    worker(_node, _inputs, _outputs) { }

}

class RotateReteComponent extends Rete.Component {

    constructor() {
        super('Rotate')
    }

    builder(node) {

        var inputGroups = new Rete.Input('groups', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputCenter = new Rete.Input('center', t('Center'), PMG.NodesEditor.sockets.point)
        var inputAxis = new Rete.Input('axis', t('Axis'), PMG.NodesEditor.sockets.vector)
        var inputAngle = new Rete.Input('angle', t('Angle'), PMG.NodesEditor.sockets.number)
        inputAngle.addControl(new NumberReteControl(this.editor, 'angle', t('Angle')))

        var outputGroups = new Rete.Output('groups', t('Groups'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(inputGroups)
            .addInput(inputCenter)
            .addInput(inputAxis)
            .addInput(inputAngle)
            .addOutput(outputGroups)

    }

    worker(_node, _inputs, _outputs) { }

}

class ScaleReteComponent extends Rete.Component {

    constructor() {
        super('Scale')
    }

    builder(node) {

        var inputGroups = new Rete.Input('groups', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputPoint = new Rete.Input('point', t('Point'), PMG.NodesEditor.sockets.point)
        var inputXFactor = new Rete.Input('x_factor', t('X factor'), PMG.NodesEditor.sockets.number)
        inputXFactor.addControl(new NumberReteControl(this.editor, 'x_factor', t('X factor')))
        var inputYFactor = new Rete.Input('y_factor', 'Y factor', PMG.NodesEditor.sockets.number)
        inputYFactor.addControl(new NumberReteControl(this.editor, 'y_factor', t('Y factor')))
        var inputZFactor = new Rete.Input('z_factor', 'Z factor', PMG.NodesEditor.sockets.number)
        inputZFactor.addControl(new NumberReteControl(this.editor, 'z_factor', t('Z factor')))

        var outputGroups = new Rete.Output('groups', t('Groups'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(inputGroups)
            .addInput(inputPoint)
            .addInput(inputXFactor)
            .addInput(inputYFactor)
            .addInput(inputZFactor)
            .addOutput(outputGroups)

    }

    worker(_node, _inputs, _outputs) { }

}

class PaintReteComponent extends Rete.Component {

    constructor() {
        super('Paint')
    }

    builder(node) {

        var inputGroups = new Rete.Input('groups', t('Groups'), PMG.NodesEditor.sockets.groups)

        var outputGroups = new Rete.Output('groups', t('Groups'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(inputGroups)
            .addControl(new MaterialReteControl(this.editor, 'material'))
            .addOutput(outputGroups)

    }

    worker(_node, _inputs, _outputs) { }

}

class TagReteComponent extends Rete.Component {

    constructor() {
        super('Tag')
    }

    builder(node) {

        var inputGroups = new Rete.Input('groups', t('Groups'), PMG.NodesEditor.sockets.groups)

        var outputGroups = new Rete.Output('groups', t('Groups'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(inputGroups)
            .addControl(new LayerReteControl(this.editor, 'layer'))
            .addOutput(outputGroups)

    }

    worker(_node, _inputs, _outputs) { }

}

class EraseReteComponent extends Rete.Component {

    constructor() {
        super('Erase')
    }

    builder(node) {

        var groups = new Rete.Input('groups', t('Groups'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(groups)

    }

    worker(_node, _inputs, _outputs) { }

}

class CopyReteComponent extends Rete.Component {

    constructor() {
        super('Copy')
    }

    builder(node) {

        var inputGroups = new Rete.Input('groups', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputCopies = new Rete.Input('copies', t('Copies'), PMG.NodesEditor.sockets.number)
        inputCopies.addControl(new NumberReteControl(this.editor, 'copies', t('Copies')))

        var outputCopiedGroups = new Rete.Output('groups', t('Copied groups'), PMG.NodesEditor.sockets.groups)
        var outputOriginalGroups = new Rete.Output('original_groups', t('Original groups'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(inputGroups)
            .addInput(inputCopies)
            .addControl(new CheckBoxReteControl(this.editor, 'output_original', t('Put originals with copies')))
            .addOutput(outputCopiedGroups)
            .addOutput(outputOriginalGroups)

    }

    worker(_node, _inputs, _outputs) { }

}

class ConcatenateReteComponent extends Rete.Component {

    constructor() {
        super('Concatenate')
    }

    builder(node) {

        var inputGroups1 = new Rete.Input('groups1', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups2 = new Rete.Input('groups2', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups3 = new Rete.Input('groups3', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups4 = new Rete.Input('groups4', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups5 = new Rete.Input('groups5', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups6 = new Rete.Input('groups6', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups7 = new Rete.Input('groups7', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups8 = new Rete.Input('groups8', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups9 = new Rete.Input('groups9', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups10 = new Rete.Input('groups10', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups11 = new Rete.Input('groups11', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups12 = new Rete.Input('groups12', t('Groups'), PMG.NodesEditor.sockets.groups)

        var outputGroups = new Rete.Output('groups', t('Groups'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(inputGroups1)
            .addInput(inputGroups2)
            .addInput(inputGroups3)
            .addInput(inputGroups4)
            .addInput(inputGroups5)
            .addInput(inputGroups6)
            .addInput(inputGroups7)
            .addInput(inputGroups8)
            .addInput(inputGroups9)
            .addInput(inputGroups10)
            .addInput(inputGroups11)
            .addInput(inputGroups12)
            .addOutput(outputGroups)

    }

    worker(_node, _inputs, _outputs) { }

}

class SelectReteComponent extends Rete.Component {

    constructor() {
        super('Select')
    }

    builder(node) {

        var inputGroups = new Rete.Input('groups', t('Groups'), PMG.NodesEditor.sockets.groups)

        var inputA = new Rete.Input('a', t('Variable A'), PMG.NodesEditor.sockets.number)
        inputA.addControl(new NumberReteControl(this.editor, 'a', t('Variable A')))

        var inputB = new Rete.Input('b', t('Variable B'), PMG.NodesEditor.sockets.number)
        inputB.addControl(new NumberReteControl(this.editor, 'b', t('Variable B')))

        var inputC = new Rete.Input('c', t('Variable C'), PMG.NodesEditor.sockets.number)
        inputC.addControl(new NumberReteControl(this.editor, 'c', t('Variable C')))

        var inputD = new Rete.Input('d', t('Variable D'), PMG.NodesEditor.sockets.number)
        inputD.addControl(new NumberReteControl(this.editor, 'd', t('Variable D')))

        var inputE = new Rete.Input('e', t('Variable E'), PMG.NodesEditor.sockets.number)
        inputE.addControl(new NumberReteControl(this.editor, 'e', t('Variable E')))

        var inputF = new Rete.Input('f', t('Variable F'), PMG.NodesEditor.sockets.number)
        inputF.addControl(new NumberReteControl(this.editor, 'f', t('Variable F')))

        var inputG = new Rete.Input('g', t('Variable G'), PMG.NodesEditor.sockets.number)
        inputG.addControl(new NumberReteControl(this.editor, 'g', t('Variable G')))

        var inputH = new Rete.Input('h', t('Variable H'), PMG.NodesEditor.sockets.number)
        inputH.addControl(new NumberReteControl(this.editor, 'h', t('Variable H')))

        var inputI = new Rete.Input('i', t('Variable I'), PMG.NodesEditor.sockets.number)
        inputI.addControl(new NumberReteControl(this.editor, 'i', t('Variable I')))

        var inputJ = new Rete.Input('j', t('Variable J'), PMG.NodesEditor.sockets.number)
        inputJ.addControl(new NumberReteControl(this.editor, 'j', t('Variable J')))

        var inputK = new Rete.Input('k', t('Variable K'), PMG.NodesEditor.sockets.number)
        inputK.addControl(new NumberReteControl(this.editor, 'k', t('Variable K')))

        var inputL = new Rete.Input('l', t('Variable L'), PMG.NodesEditor.sockets.number)
        inputL.addControl(new NumberReteControl(this.editor, 'l', t('Variable L')))

        var outputGroups = new Rete.Output('groups', t('Matching groups'), PMG.NodesEditor.sockets.groups)

        var outputNotGroups = new Rete.Output('not_groups', t('Not matching groups'), PMG.NodesEditor.sockets.groups)

        return node
            .addControl(new TextReteControl(this.editor, 'query', t('Query example:') + ' odd'))
            .addInput(inputGroups)
            .addInput(inputA)
            .addInput(inputB)
            .addInput(inputC)
            .addInput(inputD)
            .addInput(inputE)
            .addInput(inputF)
            .addInput(inputG)
            .addInput(inputH)
            .addInput(inputI)
            .addInput(inputJ)
            .addInput(inputK)
            .addInput(inputL)
            .addOutput(outputGroups)
            .addOutput(outputNotGroups)

    }

    worker(_node, _inputs, _outputs) { }

}

class MakeGroupReteComponent extends Rete.Component {

    constructor() {
        super('Make group')
    }

    builder(node) {

        var inputGroups1 = new Rete.Input('groups1', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups2 = new Rete.Input('groups2', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups3 = new Rete.Input('groups3', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups4 = new Rete.Input('groups4', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups5 = new Rete.Input('groups5', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups6 = new Rete.Input('groups6', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups7 = new Rete.Input('groups7', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups8 = new Rete.Input('groups8', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups9 = new Rete.Input('groups9', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups10 = new Rete.Input('groups10', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups11 = new Rete.Input('groups11', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups12 = new Rete.Input('groups12', t('Groups'), PMG.NodesEditor.sockets.groups)

        var outputGroup = new Rete.Output('groups', t('Group'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(inputGroups1)
            .addInput(inputGroups2)
            .addInput(inputGroups3)
            .addInput(inputGroups4)
            .addInput(inputGroups5)
            .addInput(inputGroups6)
            .addInput(inputGroups7)
            .addInput(inputGroups8)
            .addInput(inputGroups9)
            .addInput(inputGroups10)
            .addInput(inputGroups11)
            .addInput(inputGroups12)
            .addControl(new TextReteControl(this.editor, 'name', t('Name')))
            .addControl(new MaterialReteControl(this.editor, 'material'))
            .addControl(new LayerReteControl(this.editor, 'layer'))
            .addOutput(outputGroup)

    }

    worker(_node, _inputs, _outputs) { }

}

class CommentReteComponent extends Rete.Component {

    constructor() {
        super('Comment')
    }

    builder(node) {

        return node
            .addControl(new TextAreaReteControl(this.editor, 'comment', '...'))

    }

    worker(_node, _inputs, _outputs) { }

}

class GroupReteComponent extends Rete.Component {

    constructor() {
        super('Group')
    }

    builder(node) {

        node.data.width = node.data.width || 400
        node.data.height = node.data.height || 300

        return node
            .addControl(new TextReteControl(this.editor, 'name', t('Name')))
            .addControl(new NumberReteControl(this.editor, 'width', t('Width')))
            .addControl(new NumberReteControl(this.editor, 'height', t('Height')))

    }

    worker(_node, _inputs, _outputs) { }

}


class HistoryManager {

    constructor(editor) {

        this.editor = editor
        this.history = []
        this.future = []
        this.active = true
        this.limit = 50

        // Listeners
        this.editor.on('nodecreated noderemoved connectioncreated connectionremoved', () => {
            this.push()
        })

        // Dragging end listener
        var container = this.editor.view.container
        var wasDragging = false

        this.editor.on('nodedragged', () => {
            wasDragging = true
        })

        // Use capture to ensure we catch it
        container.addEventListener('mouseup', () => {
            if (wasDragging) {
                wasDragging = false
                this.push()
            }
        })

        // Key listeners
        window.addEventListener('keydown', e => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                this.undo()
                e.preventDefault()
                e.stopPropagation()
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                this.redo()
                e.preventDefault()
                e.stopPropagation()
            }
        })

    }

    push() {

        if (!this.active) return

        var state = JSON.stringify(this.editor.toJSON())

        if (this.history.length > 0) {
            var lastState = this.history[this.history.length - 1]
            if (state === lastState) return
        }

        this.history.push(state)

        if (this.history.length > this.limit) this.history.shift()

        this.future = []

    }

    undo() {

        if (this.history.length <= 1) return

        this.active = false

        var current = this.history.pop()
        this.future.push(current)

        var prev = this.history[this.history.length - 1]

        this.editor.fromJSON(JSON.parse(prev)).then(() => {
            this.active = true
            PMG.NodesEditor.exportModelSchema(true)
        })

    }

    redo() {

        if (this.future.length === 0) return

        this.active = false

        var next = this.future.pop()
        this.history.push(next)

        this.editor.fromJSON(JSON.parse(next)).then(() => {
            this.active = true
            PMG.NodesEditor.exportModelSchema(true)
        })

    }

}

PMG.codeName = 'ParametricModeling'

PMG.NodesEditor.initializeHistory = () => {
    PMG.NodesEditor.history = new HistoryManager(PMG.NodesEditor.editor)
}

PMG.NodesEditor.initializeEditor = () => {

    PMG.NodesEditor.editor = new Rete.NodeEditor(
        PMG.codeName + '@' + PMGNodesEditorSchemaVersion,
        document.querySelector('#pmg-nodes-editor')
    )

    PMG.NodesEditor.editor.use(VueRenderPlugin.default)
    PMG.NodesEditor.editor.use(ConnectionPlugin.default)
    PMG.NodesEditor.editor.use(MinimapPlugin.default)

}

PMG.NodesEditor.initializeEngine = () => {

    PMG.NodesEditor.engine = new Rete.Engine(
        PMG.codeName + '@' + PMGNodesEditorSchemaVersion
    )

}

PMG.NodesEditor.initializeComponents = () => {

    PMG.NodesEditor.components = {

        "Draw box": new DrawBoxReteComponent(),
        "Draw prism": new DrawPrismReteComponent(),
        "Draw cylinder": new DrawCylinderReteComponent(),
        "Draw tube": new DrawTubeReteComponent(),
        "Draw pyramid": new DrawPyramidReteComponent(),
        "Draw cone": new DrawConeReteComponent(),
        "Draw sphere": new DrawSphereReteComponent(),
        "Draw shape": new DrawShapeReteComponent(),
        "Number": new NumberReteComponent(),
        "Add": new AddReteComponent(),
        "Subtract": new SubtractReteComponent(),
        "Multiply": new MultiplyReteComponent(),
        "Divide": new DivideReteComponent(),
        "Calculate": new CalculateReteComponent(),
        "Point": new PointReteComponent(),
        "Get points": new GetPointsReteComponent(),
        "Vector": new VectorReteComponent(),
        "Intersect solids": new IntersectSolidsReteComponent(),
        "Unite solids": new UniteSolidsReteComponent(),
        "Subtract solids": new SubtractSolidsReteComponent(),
        "Push/Pull": new PushPullReteComponent(),
        "Move": new MoveReteComponent(),
        "Align": new AlignReteComponent(),
        "Rotate": new RotateReteComponent(),
        "Scale": new ScaleReteComponent(),
        "Paint": new PaintReteComponent(),
        "Tag": new TagReteComponent(),
        "Erase": new EraseReteComponent(),
        "Copy": new CopyReteComponent(),
        "Concatenate": new ConcatenateReteComponent(),
        "Select": new SelectReteComponent(),
        "Make group": new MakeGroupReteComponent(),
        "Group": new GroupReteComponent(),
        "Comment": new CommentReteComponent()

    }

}

PMG.NodesEditor.registerComponents = () => {

    for (var nodeName in PMG.NodesEditor.components) {

        var component = PMG.NodesEditor.components[nodeName]

        PMG.NodesEditor.editor.register(component)
        PMG.NodesEditor.engine.register(component)

    }

}

PMG.NodesEditor.loadToolbarIcons = () => {

    document.querySelectorAll('.toolbar .node-icon').forEach(toolbarNodeIcon => {

        toolbarNodeIcon.src = PMGNodesEditorIcons['nodes'][toolbarNodeIcon.dataset.nodeName]['path']
        toolbarNodeIcon.title = t(toolbarNodeIcon.dataset.nodeName)

    })

    var toolbarHelpIcon = document.querySelector('.toolbar .help-icon')

    toolbarHelpIcon.src = PMGNodesEditorIcons['help']['path']
    toolbarHelpIcon.title = PMGNodesEditorIcons['help']['title']

    if (SketchUpVersion < 21) {
        new Drooltip({
            element: '.toolbar .node-icon, .toolbar .help-icon',
            position: 'bottom',
            background: '#fff',
            color: '#000',
            animation: 'fade'
        })
    }

}

PMG.NodesEditor.adaptNumberInputStep = input => {

    if (input.value === '') {

        input.step = 1
        return

    }

    if (isNaN(parseFloat(input.step))) {
        input.step = 1
    }

    if (input.value.indexOf('.') !== -1) {

        var inputParts = input.value.split('.')

        if (inputParts.length === 2) {

            var inputDecimalPart = inputParts[1]
            var inputStepCandidate = 1 / parseFloat('1' + '0'.repeat(inputDecimalPart.length))

            if (inputStepCandidate < input.step) {
                input.step = inputStepCandidate
            }

        }

    }

}

PMG.NodesEditor.schemaIsExportable = false
PMG.NodesEditor.preservedSelection = null;

PMG.NodesEditor.exportModelSchema = redraw => {

    if (PMG.NodesEditor.schemaIsExportable) {
        sketchup.exportModelSchema(JSON.stringify(PMG.NodesEditor.editor.toJSON()), redraw)
    }

}

PMG.NodesEditor.addNode = (nodeName, nodeData) => {

    nodeData = (nodeData === undefined) ? {} : nodeData

    var component = PMG.NodesEditor.components[nodeName]
    var mouse = PMG.NodesEditor.editor.view.area.mouse

    component.createNode(nodeData).then(node => {

        node.position = [mouse.x, mouse.y]
        PMG.NodesEditor.editor.addNode(node)

        PMG.NodesEditor.nodeBeingAdded = node

    })

}

PMG.NodesEditor.resizeEditorView = () => {
    document.querySelector('#pmg-nodes-editor').style.height = window.innerHeight + 'px'
}

PMG.NodesEditor.createColorPicker = (callback) => {
    const colors = [
        '#ff4444', '#ff8800', '#ffcc00', '#99cc00', '#33b5e5',
        '#0099cc', '#aa66cc', '#9933cc', '#669900', '#cc0000',
        '#ffbb33', '#FF00FF', '#795548', '#607D8B', '#000000'
    ]

    const overlay = document.createElement('div')
    overlay.className = 'picker-overlay'

    const modal = document.createElement('div')
    modal.className = 'picker-modal'
    modal.innerHTML = `<h3>${t('Select Color')}</h3><div class="picker-grid"></div>`

    const grid = modal.querySelector('.picker-grid')

    colors.forEach(color => {
        const option = document.createElement('div')
        option.className = 'color-option'
        option.style.backgroundColor = color
        option.onclick = () => {
            callback(color)
            document.body.removeChild(overlay)
        }
        grid.appendChild(option)
    })

    const closeBtn = document.createElement('button')
    closeBtn.className = 'picker-close'
    closeBtn.innerText = t('Close')
    closeBtn.onclick = () => document.body.removeChild(overlay)

    modal.appendChild(closeBtn)
    overlay.appendChild(modal)
    document.body.appendChild(overlay)
}

PMG.NodesEditor.createIconPicker = (callback) => {
    const icons = [
        '⭐', '🚀', '🔥', '💡', '✅',
        '❌', '⚠️', '⚙️', '💎', '❤️',
        '📦', '🛠️', '🧱', '📏', '✏️'
    ]

    const overlay = document.createElement('div')
    overlay.className = 'picker-overlay'

    const modal = document.createElement('div')
    modal.className = 'picker-modal'
    modal.innerHTML = `<h3>${t('Select Icon')}</h3><div class="picker-grid"></div>`

    const grid = modal.querySelector('.picker-grid')

    icons.forEach(icon => {
        const option = document.createElement('div')
        option.className = 'icon-option'
        option.innerText = icon
        option.onclick = () => {
            callback(icon)
            document.body.removeChild(overlay)
        }
        grid.appendChild(option)
    })

    const closeBtn = document.createElement('button')
    closeBtn.className = 'picker-close'
    closeBtn.innerText = t('Close')
    closeBtn.onclick = () => document.body.removeChild(overlay)

    modal.appendChild(closeBtn)
    overlay.appendChild(modal)
    document.body.appendChild(overlay)
}

PMG.NodesEditor.addEventListeners = () => {

    PMG.NodesEditor.editor.on('process nodecreated noderemoved connectioncreated connectionremoved', () => {

        PMG.NodesEditor.engine.abort().then(() => {
            PMG.NodesEditor.engine.process(PMG.NodesEditor.editor.toJSON())
        })

    })

    PMG.NodesEditor.updateLockedNodes = () => {
        PMG.NodesEditor.editor.nodes.forEach(node => {
            const nodeElement = node.vueContext.$el
            const isLocked = node.data.locked === true

            if (isLocked) {
                nodeElement.classList.add('locked')
                nodeElement.querySelectorAll('input, select, textarea').forEach(el => {
                    el.disabled = true
                    el.title = "Locked"
                })
            } else {
                nodeElement.classList.remove('locked')
                nodeElement.querySelectorAll('input, select, textarea').forEach(el => {
                    el.disabled = false
                    el.title = ""
                })
            }
        })
    }

    // Call updateLockedNodes on process to ensure persistence
    PMG.NodesEditor.editor.on('process', () => {
        PMG.NodesEditor.updateLockedNodes()
    })

    PMG.NodesEditor.editor.on('nodecreated noderemoved connectioncreated connectionremoved', () => {
        // Also update here
        setTimeout(() => { PMG.NodesEditor.updateLockedNodes() }, 10)
        PMG.NodesEditor.exportModelSchema(true)
    })

    // Preserve selection on pointerdown (handles both mouse and touch) to allow multi-drag without CTRL
    // We use capture=true to get the event before Rete clears the selection
    const captureSelectionState = (e) => {
        const nodeEl = e.target.closest('.node')
        if (nodeEl) {
            // Found a node element
            const nodeId = nodeEl.getAttribute('data-node-id')
            // Find node object
            const node = PMG.NodesEditor.editor.nodes.find(n => n.id == nodeId)

            if (node) {
                const currentSelection = PMG.NodesEditor.editor.selected.list
                if (currentSelection.includes(node)) {
                    // Clicked on a selected node -> Preserve the ENTIRE selection
                    PMG.NodesEditor.preservedSelection = [...currentSelection]
                } else {
                    // Clicked on an unselected node -> Default behavior (will select just this one)
                    PMG.NodesEditor.preservedSelection = null
                }
            } else {
                PMG.NodesEditor.preservedSelection = null
            }
        } else {
            // Clicked background, socket, etc.
            PMG.NodesEditor.preservedSelection = null
        }
    }

    // Use capture to intervene before Rete
    document.addEventListener('mousedown', captureSelectionState, true)
    document.addEventListener('touchstart', captureSelectionState, true)

    const clearPreserved = () => {
        // We delay clearing slightly to allow drag start to pick it up
        setTimeout(() => { PMG.NodesEditor.preservedSelection = null }, 100)
    }
    document.addEventListener('mouseup', clearPreserved)
    document.addEventListener('touchend', clearPreserved)

    // Prevent connections involving locked nodes
    PMG.NodesEditor.editor.on('connectioncreate', connection => {
        if (connection.input.node.data.locked || connection.output.node.data.locked) {
            return false
        }
    })

    PMG.NodesEditor.editor.on('connectionremove', connection => {
        if (connection.input.node.data.locked || connection.output.node.data.locked) {
            return false
        }
    })

    PMG.NodesEditor.editor.on('rendernode', ({ el, node }) => {
        if (node.data.locked) {
            el.classList.add('locked')
            el.querySelectorAll('input, select, textarea').forEach(element => {
                element.disabled = true
                element.title = "Locked"
            })
        }
    })

    PMG.NodesEditor.editor.on('nodedragged', () => {
        PMG.NodesEditor.updateLockedNodes()
        PMG.NodesEditor.exportModelSchema(false)
    })

    PMG.NodesEditor.editor.on('nodecreated', node => {

        var nodeElement = node.vueContext.$el

        nodeElement.setAttribute('data-node-id', node.id)

        var contextMenuItems = []

        if (!node.data.locked) {
            contextMenuItems.push({
                name: t('Remove this node'),
                fn: () => { PMG.NodesEditor.editor.removeNode(node) }
            })
        }

        contextMenuItems.push({
            name: node.data.locked ? t('Unlock node') : t('Lock node'),
            fn: () => {
                node.data.locked = !node.data.locked

                // Trigger visual update
                PMG.NodesEditor.updateLockedNodes()

                // Re-create context menu to update options
                PMG.NodesEditor.editor.trigger('nodecreated', node)
                PMG.NodesEditor.exportModelSchema(true)
            }
        })

        if (!node.data.locked) {
            contextMenuItems.push(
                {
                    name: t('Rename node'),
                    fn: () => {
                        var newName = prompt(t('Enter new name'), node.data.customName || t(node.name))
                        if (newName !== null) {
                            node.data.customName = newName
                            PMG.NodesEditor.editor.trigger('nodecreated', node)
                            PMG.NodesEditor.exportModelSchema(true)
                        }
                    }
                },
                {
                    name: t('Set color'),
                    fn: () => {
                        PMG.NodesEditor.createColorPicker(color => {
                            node.data.customColor = color
                            PMG.NodesEditor.editor.trigger('nodecreated', node)
                            PMG.NodesEditor.exportModelSchema(true)
                        })
                    }
                },
                {
                    name: t('Set icon'),
                    fn: () => {
                        PMG.NodesEditor.createIconPicker(icon => {
                            node.data.customIcon = icon
                            PMG.NodesEditor.editor.trigger('nodecreated', node)
                            PMG.NodesEditor.exportModelSchema(true)
                        })
                    }
                }
            )
        }

        if (node.contextMenuInstance) {
            node.contextMenuInstance.destroy()
        }

        node.contextMenuInstance = new ContextMenu('.node[data-node-id="' + node.id + '"] *', contextMenuItems)


        if (node.data.locked) {
            nodeElement.classList.add('locked')
        }

        // Intercept translate to prevent movement if locked
        if (!node.vueContext._originalTranslate) {
            node.vueContext._originalTranslate = node.translate
            // We need to override the view's translate, but Rete's node.translate updates data/view.
            // Actually Rete Node does not have translate, the NodeView has.
            // We can accces NodeView via editor.view.nodes.get(node)
            // But here 'node' is the data model. 'node.vueContext' is the Vue component.
            // It's safer to check lock in 'nodedragged' or override the view's method globally or per instance.
        }

        // We will handle the locking mechanism by overriding the view's translate method immediately
        setTimeout(() => {
            const nodeView = PMG.NodesEditor.editor.view.nodes.get(node)
            if (nodeView && !nodeView._originalTranslate) {
                nodeView._originalTranslate = nodeView.translate
                nodeView.translate = function (x, y) {
                    if (node.data.locked) {
                        return // Do nothing
                    }

                    const dx = x - node.position[0]
                    const dy = y - node.position[1]

                    // Call original
                    nodeView._originalTranslate.call(nodeView, x, y)

                    // Move other selected nodes if this node is selected
                    if ((dx !== 0 || dy !== 0) && !PMG.NodesEditor.isMovingSelection) {
                        let selectedNodes = PMG.NodesEditor.editor.selected.list

                        // Check preserved selection
                        if (selectedNodes.length <= 1 && PMG.NodesEditor.preservedSelection && PMG.NodesEditor.preservedSelection.includes(node)) {
                            // RESTORE SELECTION VISUALLY
                            // We re-add them to editor selection so they look orange and active
                            PMG.NodesEditor.preservedSelection.forEach(n => {
                                if (!selectedNodes.includes(n)) {
                                    PMG.NodesEditor.editor.selected.add(n)
                                }
                            })
                            // Update our local reference
                            selectedNodes = PMG.NodesEditor.editor.selected.list
                        }

                        if (selectedNodes.includes(node)) {
                            PMG.NodesEditor.isMovingSelection = true
                            try {
                                selectedNodes.forEach(otherNode => {
                                    if (otherNode !== node) {
                                        const otherView = PMG.NodesEditor.editor.view.nodes.get(otherNode)
                                        if (otherView) {
                                            otherView.translate(otherNode.position[0] + dx, otherNode.position[1] + dy)
                                        }
                                    }
                                })
                            } finally {
                                PMG.NodesEditor.isMovingSelection = false
                            }
                        }
                    }
                }
            }
        }, 10)

        if (SketchUpVersion < 21) {
            new Drooltip({
                element: '.node[data-node-id="' + node.id + '"] .socket',
                position: 'bottom',
                background: '#fff',
                color: '#000',
                animation: 'fade'
            })
        }

        nodeElement.querySelectorAll('input[type="number"]').forEach(nodeNumberInputElement => {

            nodeNumberInputElement.addEventListener('input', _event => {

                PMG.NodesEditor.exportModelSchema(true)

                PMG.NodesEditor.adaptNumberInputStep(nodeNumberInputElement)

            })

        })

        nodeElement.querySelectorAll('input[type="text"]').forEach(nodeTextInputElement => {

            nodeTextInputElement.addEventListener('input', _event => {
                PMG.NodesEditor.exportModelSchema(true)
            })

        })

        nodeElement.querySelectorAll('textarea').forEach(nodeTextAreaElement => {

            nodeTextAreaElement.addEventListener('input', _event => {

                if (node.name === 'Comment') {
                    PMG.NodesEditor.exportModelSchema(false)
                } else {
                    PMG.NodesEditor.exportModelSchema(true)
                }

            })

        })

        nodeElement.querySelectorAll('input[type="checkbox"]').forEach(nodeCheckBoxInputElement => {

            nodeCheckBoxInputElement.addEventListener('change', _event => {
                PMG.NodesEditor.exportModelSchema(true)
            })

        })

        nodeElement.querySelectorAll('select').forEach(nodeSelectElement => {

            nodeSelectElement.addEventListener('change', _event => {
                PMG.NodesEditor.exportModelSchema(true)
            })

        })

        var nodeTitleElement = nodeElement.querySelector('.title')

        nodeTitleElement.innerHTML = node.data.customName ? node.data.customName : t(node.name)

        if (node.data.customColor) {
            nodeTitleElement.style.background = node.data.customColor
        } else {
            var nodeTitleGradient = 'linear-gradient(0deg,hsla(0,0%,100%,.05) 0,hsla(0,0%,100%,.05)' +
                ' 40%,hsla(0,0%,100%,.19)),radial-gradient(70% 40px at center,' +
                PMGNodesEditorIcons['nodes'][node.name]['color'] + ' 0,rgba(0,0,0,0) 60%)'

            nodeTitleElement.style.backgroundImage = nodeTitleGradient
        }

        if (node.data.customIcon) {
            var iconSpan = document.createElement('span')
            iconSpan.className = 'icon'
            iconSpan.textContent = node.data.customIcon
            iconSpan.style.fontSize = '20px'
            iconSpan.style.textAlign = 'center'
            nodeTitleElement.appendChild(iconSpan)
        } else {
            var nodeTitleIconElement = document.createElement('img')

            if (PMGNodesEditorIcons['nodes'][node.name]) {
                nodeTitleIconElement.src = PMGNodesEditorIcons['nodes'][node.name]['path']
            }

            nodeTitleIconElement.className = 'icon'
            nodeTitleElement.appendChild(nodeTitleIconElement)
        }

        if (node.name === 'Group') {
            nodeElement.classList.add('group')

            const updateSize = () => {
                nodeElement.style.width = node.data.width + 'px'
                nodeElement.style.height = node.data.height + 'px'
                // Also update content height if needed, but node height should suffice
            }
            // Initial size
            updateSize()

            // Listen to inputs
            nodeElement.querySelectorAll('input').forEach(input => {
                input.addEventListener('input', () => {
                    node.data.width = parseInt(node.data.width) || 400
                    node.data.height = parseInt(node.data.height) || 300
                    updateSize()
                })
            })

            // Override translate for group moving logic
            setTimeout(() => {
                const nodeView = PMG.NodesEditor.editor.view.nodes.get(node)
                if (nodeView && !nodeView._originalTranslate) {
                    nodeView._originalTranslate = nodeView.translate
                    nodeView.translate = function (x, y) {
                        const dx = x - node.position[0]
                        const dy = y - node.position[1]

                        // Check valid move
                        if (node.data.locked) return

                        nodeView._originalTranslate.call(nodeView, x, y)

                        if (dx === 0 && dy === 0) return

                        // Move children
                        const groupRect = {
                            x: x, y: y,
                            w: node.data.width, h: node.data.height
                        }

                        PMG.NodesEditor.editor.nodes.forEach(otherNode => {
                            if (otherNode.id === node.id) return
                            // Check if otherNode is inside group
                            // We use center of node or top-left? Rete uses top-left.
                            // Let's us center for better UX? Or simple containment.
                            // For now simple containment of Top-Left corner.
                            if (otherNode.position[0] >= groupRect.x &&
                                otherNode.position[0] <= groupRect.x + groupRect.w &&
                                otherNode.position[1] >= groupRect.y &&
                                otherNode.position[1] <= groupRect.y + groupRect.h) {

                                const otherView = PMG.NodesEditor.editor.view.nodes.get(otherNode)
                                if (otherView) {
                                    otherView.translate(otherNode.position[0] + dx, otherNode.position[1] + dy)
                                }
                            }
                        })
                    }
                }
            }, 10)
        }

    })

    PMG.NodesEditor.editor.on('zoom', ({ source }) => {
        return source !== 'dblclick'
    })

    PMG.NodesEditor.editor.on('mousemove', () => {

        if (PMG.NodesEditor.nodeBeingAdded === undefined) {
            return
        }

        var mouse = PMG.NodesEditor.editor.view.area.mouse

        PMG.NodesEditor.editor.view.nodes
            .get(PMG.NodesEditor.nodeBeingAdded)
            .translate(mouse.x, mouse.y)

    })

    window.addEventListener('click', event => {

        if (event.target.classList.contains('node-icon')) {
            return
        }

        PMG.NodesEditor.nodeBeingAdded = undefined

        if (event.target.classList.contains('main-path')) {

            document.querySelectorAll('.main-path.selected').forEach(connectionPath => {
                connectionPath.classList.remove('selected')
            })

            event.target.classList.add('selected')

        }

    })

    document.querySelectorAll('.toolbar .node-icon').forEach(toolbarNodeIcon => {

        toolbarNodeIcon.addEventListener('click', event => {
            PMG.NodesEditor.addNode(event.currentTarget.dataset.nodeName)
        })

    })

    document.querySelector('.toolbar .help-icon').addEventListener('click', _event => {
        sketchup.accessOnlineHelp()
    })

    window.addEventListener('resize', _event => {
        PMG.NodesEditor.resizeEditorView()
    })

}

PMG.NodesEditor.importModelSchema = () => {

    PMG.NodesEditor.engine.abort().then(() => {

        PMG.NodesEditor.editor.fromJSON(PMGNodesEditorSchema).then(() => {

            PMG.NodesEditor.engine.process(PMG.NodesEditor.editor.toJSON()).then(() => {
                PMG.NodesEditor.schemaIsExportable = true
            })

        })

    })

}

PMG.NodesEditor.showOrHideMinimap = () => {

    document.querySelector('.minimap').classList.toggle('displayed')

    // XXX This hack forces minimap display.
    PMG.NodesEditor.editor.trigger('zoomed')

}

PMG.NodesEditor.setGlobalContextMenu = () => {

    var contextMenuOptions = [
        {
            name: t('Import schema from a file'),
            fn: () => { sketchup.importSchemaFromFile() }
        },
        {
            name: t('Export schema to a file'),
            fn: () => { sketchup.exportSchemaToFile() }
        },
        {
            name: t('Freeze parametric entities'),
            fn: () => { sketchup.freezeParametricEntities() }
        },
        {
            name: t('Show or hide minimap'),
            fn: () => { PMG.NodesEditor.showOrHideMinimap() }
        },
        {
            name: t('Add a comment node'),
            fn: () => { PMG.NodesEditor.addNode('Comment') }
        },
        {
            name: t('Add a group node'),
            fn: () => { PMG.NodesEditor.addNode('Group') }
        },
        {
            name: t('Remove all nodes'),
            fn: () => { PMG.NodesEditor.editor.clear() }
        }
    ]

    new ContextMenu('#pmg-nodes-editor', contextMenuOptions)

}

PMG.NodesEditor.tagNodesAsValid = () => {

    document.querySelectorAll('.node').forEach(nodeElement => {
        nodeElement.classList.remove('invalid')
    })

}

PMG.NodesEditor.tagNodeAsInvalid = nodeId => {

    var nodeElement = document.querySelector('.node[data-node-id="' + nodeId + '"]')
    nodeElement.classList.add('invalid')

}

document.addEventListener('DOMContentLoaded', _event => {

    PMG.NodesEditor.initializeEditor()
    PMG.NodesEditor.initializeEngine()
    PMG.NodesEditor.initializeComponents()
    PMG.NodesEditor.registerComponents()
    PMG.NodesEditor.loadToolbarIcons()
    PMG.NodesEditor.addEventListeners()
    PMG.NodesEditor.importModelSchema()
    PMG.NodesEditor.setGlobalContextMenu()
    PMG.NodesEditor.resizeEditorView()
    PMG.NodesEditor.initializeHistory()
    PMG.NodesEditor.Navigator.init()

})

PMG.NodesEditor.Navigator = {
    isOpen: false,
    panel: null,

    init: function () {
        this.createIcon()
        this.createPanel()

        // Add minimal styling for the div icon if not in CSS
        // The CSS change I made used a class .search-icon but I need to make sure I create it with that class.

        // Listen to events to update list
        PMG.NodesEditor.editor.on('nodecreated noderemoved', () => {
            if (this.isOpen) this.updateList()
        })

        // 'process' event is triggered on rename, so it's good hook
        PMG.NodesEditor.editor.on('process', () => {
            if (this.isOpen) this.updateList()
        })

        // Update selection highlight in list when selection changes in editor
        PMG.NodesEditor.editor.on('nodeselected', () => {
            if (this.isOpen) this.highlightSelected()
        })
    },

    createIcon: function () {
        var toolbar = document.querySelector('.toolbar')
        var icon = document.createElement('div')
        icon.className = 'search-icon'
        icon.innerHTML = '🔍'
        icon.style.fontSize = '20px'
        icon.style.lineHeight = '30px'
        icon.style.textAlign = 'center'
        icon.style.color = 'white'
        icon.title = t('Navigator')

        icon.onclick = () => this.toggle()

        toolbar.appendChild(icon)
    },

    createPanel: function () {
        if (this.panel) return

        var div = document.createElement('div')
        div.className = 'navigator-panel'
        div.style.display = 'none'

        div.innerHTML = `
            <div class="navigator-header">
                <span class="navigator-title">${t('Navigator')}</span>
                <button class="navigator-close">×</button>
            </div>
            <div class="navigator-search">
                <input type="text" placeholder="${t('Search nodes...')}">
            </div>
            <ul class="navigator-list"></ul>
        `

        div.querySelector('.navigator-close').onclick = () => this.close()
        div.querySelector('input').oninput = (e) => this.filterList(e.target.value)

        document.body.appendChild(div)
        this.panel = div
    },

    toggle: function () {
        if (this.isOpen) this.close()
        else this.open()
    },

    open: function () {
        this.panel.style.display = 'flex'
        this.isOpen = true
        this.updateList()
        this.panel.querySelector('input').focus()
    },

    close: function () {
        this.panel.style.display = 'none'
        this.isOpen = false
    },

    updateList: function () {
        if (!this.panel) return
        var list = this.panel.querySelector('.navigator-list')
        list.innerHTML = ''
        var filter = this.panel.querySelector('input').value.toLowerCase()

        var nodes = PMG.NodesEditor.editor.nodes

        if (nodes.length === 0) {
            list.innerHTML = `<li style="padding:10px; color:#aaa; text-align:center">${t('No nodes found')}</li>`
            return
        }

        // Sort nodes by name
        var sortedNodes = [...nodes].sort((a, b) => {
            var nameA = a.data.customName || t(a.name)
            var nameB = b.data.customName || t(b.name)
            return nameA.localeCompare(nameB)
        })

        var foundAny = false
        sortedNodes.forEach(node => {
            var name = node.data.customName || t(node.name)
            if (name.toLowerCase().includes(filter)) {
                foundAny = true
                var li = document.createElement('li')
                li.className = 'navigator-item'
                li.textContent = name
                li.dataset.nodeId = node.id

                if (PMG.NodesEditor.editor.selected.contains(node)) {
                    li.classList.add('selected')
                }

                li.onclick = () => this.focusNode(node)
                list.appendChild(li)
            }
        })

        if (!foundAny) {
            list.innerHTML = `<li style="padding:10px; color:#aaa; text-align:center">${t('No nodes found')}</li>`
        }
    },

    highlightSelected: function () {
        if (!this.panel) return
        var list = this.panel.querySelector('.navigator-list')
        list.querySelectorAll('.navigator-item').forEach(li => {
            li.classList.remove('selected')
            var nodeId = parseInt(li.dataset.nodeId)
            var node = PMG.NodesEditor.editor.nodes.find(n => n.id === nodeId)
            if (node && PMG.NodesEditor.editor.selected.contains(node)) {
                li.classList.add('selected')
            }
        })
    },

    filterList: function (filter) {
        this.updateList()
    },

    focusNode: function (node) {
        // Select node
        if (!PMG.NodesEditor.editor.selected.contains(node)) {
            PMG.NodesEditor.editor.selectNode(node)
        }

        // Center view on node
        var view = PMG.NodesEditor.editor.view
        var area = view.area

        // Set zoom level to 1 (100%)
        area.transform.k = 1
        var k = area.transform.k

        var nodeView = view.nodes.get(node)
        var width = nodeView.el.offsetWidth
        var height = nodeView.el.offsetHeight

        var container = view.container
        var cx = container.clientWidth / 2
        var cy = container.clientHeight / 2

        var tx = cx - (node.position[0] + width / 2) * k
        var ty = cy - (node.position[1] + height / 2) * k

        area.zoom(k, 0, 0, 'wheel') // This might be needed to trigger internal updates or just update transform directly

        // We set transform directly for precise positioning
        area.transform.x = tx
        area.transform.y = ty
        area.update()

        this.highlightSelected()
    }
}
// End of Navigator object
