(function(){
    //generate animated background
    let shape = 'M 100 0 L 0 175 200 175 100 0 Z'; //triangle shape
    let inc = 0;
    let bgInc = 0;

    let defaults = {
        colorRange: [], //list of colors to use for elements
        background: '', //background color / image of container
        elementWidth: 500, //default element width (before randomization)
        elementHeight: 450, //default element height (before randomization)
        elements: 10, //total elements to render in background
        animate: false, //animate elements rotating
        distributed: true, //distribute elements evenly
        distributedColumns: 5, //elements per row when distributing evenly
        revolutionTime: 5, //total minutes it takes for an element to animate making one complete rotation,
        minOpacity: 0.5, //starting opacity (before randomization)
        minSize: 0.7, //starting size of element (before randomization)
        maxSize: 2.0, //maximum randomized size
        grow: 1.5 //maximum randomized growth when element is animating
    }

    function generateBackground(element, options){
        this.colorRange = options.colorRange || defaults.colorRange;
        this.background = options.background || defaults.background;
        this.elementWidth = options.elementWidth || defaults.elementWidth;
        this.elementHeight = options.elementHeight || defaults.elementHeight;
        this.elements = options.elements || defaults.elements;
        this.animate = options.animate === false ? false : defaults.animate;
        this.distributed = options.distributed === false ? false : defaults.distributed;
        this.distributedColumns = options.distributedColumns || defaults.distributedColumns;
        this.revolutionTime = options.revolutionTime || defaults.revolutionTime;
        this.minOpacity = options.minOpacity || defaults.minOpacity;
        this.minSize = options.minSize || defaults.minSize;
        this.maxSize = options.maxSize || defaults.maxSize;
        this.grow = options.grow || defaults.grow;

        //setup variables
        bgInc += 1;

        //set global CSS styling
        let css = 
            '#magicBg' + bgInc + '{width:100%; height:100%; position:relative; overflow:hidden; background:' + this.background + '}\n' +
            '#magicBg' + bgInc + ' svg{width:100%; height:100%; position:relative; top:-50%; left:-50%;}\n' + 
            '#magicBg' + bgInc + ' div{position:absolute;}\n' + 
            '.magicbgsvgs{position:absolute; height:0; overflow:hidden; opacity:0}\n';
        let svgDefs = '';
        let svgSymbols = '';
        let html = '<div id="magicBg' + bgInc + '">\n';

        //generate triangles
        for(let x = 1; x <= this.elements; x++){
            let cx, cy;
            if(this.distributed == true){
                //distribute triangles across area
                let mod = (x % this.distributedColumns);
                if(mod == 0){mod = this.distributedColumns};
                cx = Math.round(-10 + (100 / this.distributedColumns) * mod);
                cy = Math.round(-10 + (100 / (this.elements / this.distributedColumns)) * Math.ceil(x / this.distributedColumns));
            }else{
                cx = Math.round(-10 + (100 * Math.random()));
                cy = Math.round(-10 + (100 * Math.random()));
            }
            createTriangle.call(this,
                this.colorRange[0], //color1
                this.colorRange[1], //color2
                (this.minOpacity * Math.random()), //opacity
                cx, //x
                cy, //y
                (10 * Math.random()), //centerxOffset
                (10 * Math.random()), //centeryOffset
                this.minSize + ((this.maxSize - this.minSize) * Math.random()), //size
                (1.5 * Math.random()), //grow
                Math.round(360 * Math.random()), //rotation
                Math.round((60 * this.revolutionTime) + (60 * Math.random())) //speed
            );
        }

        //insert CSS, SVG, & HTML onto the page
        document.head.insertAdjacentHTML('beforeend', '<style type="text/css">' + css + '</style>');
        document.body.insertAdjacentHTML('beforeend', '<div class="magicbgsvgs"><svg xmlns="http://www.w3.org/2000/svg"><defs>' + svgDefs + '</defs></svg></div>');
        element.insertAdjacentHTML('beforeend', html + '</div>');


        function createTriangle(color1, color2, opacity, x, y, centerxOffset, centeryOffset, size, grow, rotation, speed){
            //incriment global count of triangles / gradients
            inc += 1;

            //set up triangle properties
            let width = this.elementWidth * size;
            let height = this.elementHeight * size;

            //generate an SVG (gradient & triangle) for background
            svgDefs += 
                '<linearGradient id="bgmagicgrad' + inc + '" gradientUnits="userSpaceOnUse" x1="0" y1="87.5" x2="200" y2="87.5" spreadMethod="pad">\n' +
                    '<stop offset="0%" stop-color="' + color1 + '"/>\n' +
                    '<stop offset="100%" stop-color="' + color2 + '"/>\n' +
                '</linearGradient>\n' + 
                '<g id="svgelem' + inc + '"><path fill="url(#bgmagicgrad' + inc + ')" stroke="none" d="' + shape + '"/></g>\n';

            //generate HTML that renders the SVG
            html += 
                '<div id="bgelem' + inc + '">\n' +
                    '<svg viewBox="0 0 200 175"><use xlink:href="#svgelem' + inc + '" x="0" y="0" width="200" height="175"></use></svg>\n' + 
                '</div>\n';

            //generate CSS for the SVG
            css += 
                '#bgelem' + inc + '{' + 
                    'left:' + x + '%; top:' + y + '%; ' +
                    (this.animate ? 'animation: anibgelem' + inc + ' ' + speed + 's infinite linear; ' : '') + 
                    'opacity:' + opacity + '; width:' + width + 'px; height:' + height + 'px; ' + 
                    'transform-origin:' + (50 + centerxOffset) + '% ' + (50 + centeryOffset) + '%;' +
                '}\n' +
                '#bgelem' + inc + ' > svg{transform:rotate(' + rotation + 'deg);}\n' + 
                (this.animate ? 
                '@keyframes anibgelem' + inc + '{\n' + 
                    '0% {transform:rotate(0deg); width:' + width + 'px; height:' + height + 'px;}\n' + 
                    '50% {width:' + (width * grow) + 'px; height:' + (height * grow) + 'px;}\n' +
                    '100% {transform:rotate(360deg); width:' + width + 'px; height:' + height + 'px;}\n' + 
                '}\n\n' : '');
        }
    }

    window.generateBackground = generateBackground;
})();

//generate backgrounds for header & footer
let colorRange = [];
let bg = '';
//randomly select a color scheme for generated background
let bgtype = 1 + Math.round(3 * Math.random());
//bgtype = 1; //debugging purposes only
switch(bgtype){
        
    case 1: //red & orange
        colorRange = ['#ff2b2b', '#ff8d2b'];
        bg = 'linear-gradient(#ff9499, #ff9c6d)';
        break;

    case 2: //green & blue
        colorRange = ['#009c37', '#009aab'];
        bg = 'linear-gradient(#9bdec8, #57b5ec)';
        break;
        
    case 3: //blue & purple
        colorRange = ['#2184ff', '#8a20ff'];
        bg = 'linear-gradient(#90ccff, #a682ff)';
        break;
        
    case 4: //light blue & dark blue
        colorRange = ['#25cdff', '#0066ff'];
        bg = 'linear-gradient(#b6ebff, #61a0ff)';
        break;
}

//generate header background
//generateBackground(document.getElementsByTagName('header')[0], {
//    colorRange: colorRange,
//    background: bg,
//    elements:40,
//    distributedColumns: 5
//});

//generate footer background
generateBackground(document.getElementsByClassName('contact')[0], {
    colorRange: colorRange,
    background: bg,
    elements:30,
    distributedColumns: 5
});

var listItems = document.querySelectorAll('.projects .sidebar li');

//slideshow
function slide(id){
    var oldelem = document.getElementsByClassName('project slide in');
    var elem = document.getElementsByClassName('project ' + id)[0];
    if(oldelem.length > 0){
        oldelem = oldelem[0];
        oldelem.classList.remove('in');
        oldelem.classList.add('out');
        setTimeout(() => {
            if(oldelem.classList.contains('out')){
                oldelem.classList.remove('slide', 'out');
                oldelem.classList.add('reset');
                oldelem.style.display = 'none';
                setTimeout(() => {oldelem.classList.remove('reset');}, 50);
            }
        }, 1000);
    }
    elem.classList.remove('out');
    elem.classList.add('reset');
    elem.style.display = 'block';
    setTimeout(() => {
        elem.classList.remove('reset')
        elem.classList.add('slide', 'in');
    }, 10);
    listItems.forEach(a => {
        a.classList.remove('selected');
    });
    document.getElementsByClassName('tab-' + id)[0].classList.add('selected');
}

slide('saber');