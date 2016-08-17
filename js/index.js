
// Define the dimensions of the visualization. We're using
// a size that's convenient for displaying the graphic on
// http://jsDataV.is

var width = 640,
    height = 480;

// Before we do anything else, let's define the data for the visualization.

var graph = {
    "nodes": [  {  "type": "a" },
                {  "type": "a"  },
                {  "type": "b"  },
                {  "type": "b"  },
              
              {  "type": "a" },
                {"type": "a"  },
                {  "type": "b"  },
                { "type": "b"  },
                            {  "type": "a" },
                {"type": "a"  },
                {  "type": "b"  },
                { "type": "b"  },
                            {  "type": "a" },
                {"type": "a"  },
                {  "type": "b"  },
                { "type": "b"  },
                            {  "type": "a" },
                {"type": "a"  },
                {  "type": "b"  },
                { "type": "b"  },
                            {  "type": "a" },
                {"type": "a"  },
                {  "type": "b"  },
                { "type": "b"  },
                            {  "type": "a" },
                {"type": "a"  },
                {  "type": "b"  },
                { "type": "b"  },
                            {  "type": "a" },
                {"type": "a"  },
                {  "type": "b"  },
                { "type": "b"  },


            ],
    "links": [  { "target":  1, "source":  0 },
                { "target":  2, "source":  0 },
                { "target":  3, "source":  0 },
              
                { "target":  0, "source":  1 },
                { "target":  2, "source":  1 },
                { "target":  3, "source":  1 },
              
                { "target":  0, "source":  2 },
                { "target":  1, "source":  2 },
                { "target":  3, "source":  2 },
                
                { "target":  0, "source":  3 },
                { "target":  1, "source":  3 },
                { "target":  2, "source":  3 }
                        
            ]
    };

// Here's were the code begins. We start off by creating an SVG
// container to hold the visualization. We only need to specify
// the dimensions for this container.

var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

// Extract the nodes and links from the data.
var nodes = graph.nodes,
    links = graph.links;

function quadTobezier(a,b,c,x1,x2){
    // express a given quadratic function as a bezier curve
    // quad: Y = a*x^2 + b*x + c
    // plot it in domain [x1,x2]
    // return P1, P2, and C (points 1, 2, and control point)
    p1 = [x1, a*x1^2 + b*x1 + c]
    p2 = [x2, a*x2^2 + b*x2 + c]
    c =  [(x1 + x2)/2 , (x2 - x1)/2 * (2*a*x1 + b) + a*x1^2 + b*x1 + c]
    return 'M' + p1[0] + ',' + p1[1] + ' Q' + c[0] + ',' + c[1] + ' ' + p2[0] + ',' + p2[1]
}


temp = quadTobezier(-.80042, 25.80619, 226.63664, 8, 22)

svg.append('svg:path')
    .attr('d','M 100,250 Q 250,100 400,250')
    .attr('fill','blue')
    .attr('stroke','blue')
    .attr('stoke-width',2)

// svg.append('svg:path')
//     .attr('d',temp)
//     .attr('fill','red')
//     .attr('stroke','blue')
//     .attr('stoke-width',2)

//Get path start point for placing marker
function pathStartPoint(path) {
    var d = path.attr("d"),
    dsplitted = d.split(" ");
    return dsplitted[1].split(",");
}

var path = d3.select('svg').select('path'),
startPoint = pathStartPoint(path)




na = 30
nb = 30

var nodes = [];
for (i=0; i< na; i++){nodes.push({"type":"a"})}
for (i=0; i< nb; i++){nodes.push({"type":"b"})}



nodes.forEach(function(d){
  d.x = width/2 + (Math.random() -.5) * 100;
  d.y = height/2 + (Math.random() -.5) * 100;
})

nodes.forEach(function(d){
  d.x = Number(startPoint[0]) + (Math.random() -.5) * 100;
  d.y = Number(startPoint[1]) + (Math.random() -.5) * 100;
})

var links = [];
for (i=0 ; i < nodes.length; i++){
  for (j=(i+1); j < nodes.length; j++){
    links.push({"target" : i, "source": j})
  }
}

// Now we create a force layout object and define its properties.
// Those include the dimensions of the visualization and the arrays
// of nodes and links.

var force = d3.layout.force()
    .size([width, height])
    .charge(-150)
    .linkStrength(0.25)
    .nodes(nodes)
    .links(links);

// There's one more property of the layout we need to define,
// its `linkDistance`. That's generally a configurable value and,
// for a simple example, we'd normally leave it at its default.
// Unfortunately, the default value results in a visualization
// that's not especially clear. This parameter defines the
// distance (normally in pixels) that we'd like to have between
// nodes that are connected. (It is, thus, the length we'd
// like our links to have.)


force.linkDistance(function(d,i){
  if (d.source.type != d.target.type){
    return 70 + Math.random()*30
  }else{
    return 30 - Math.random()*10
  }
});

// Next we'll add the nodes and links to the visualization.
// Note that we're just sticking them into the SVG container
// at this point. We start with the links. The order here is
// important because we want the nodes to appear "on top of"
// the links. SVG doesn't really have a convenient equivalent
// to HTML's `z-index`; instead it relies on the order of the
// elements in the markup. By adding the nodes _after_ the
// links we ensure that nodes appear on top of links.

// Links are pretty simple. They're just SVG lines. We're going
// to position the lines according to the centers of their
// source and target nodes. You'll note that the `source`
// and `target` properties are indices into the `nodes`
// array. That's how our JSON is structured and that's how
// D3's force layout expects its inputs. As soon as the layout
// begins executing, however, it's going to replace those
// properties with references to the actual node objects
// instead of indices.



// Now it's the nodes turn. Each node is drawn as a circle and
// given a radius and initial position within the SVG container.
// As is normal with SVG circles, the position is specified by
// the `cx` and `cy` attributes, which define the center of the
// circle. We actually don't have to position the nodes to start
// off, as the force layout is going to immediately move them.
// But this makes it a little easier to see what's going on
// before we start the layout executing.

var node = svg.selectAll('.node')
    .data(nodes)
    .enter().append('circle')
    .attr('class', 'node')
    .style('fill', function(d,i) {
      if (d.type == "a"){
        return "red"
      }else{
        return "blue"
      }})
    .attr('r', width/200)
    .attr('cx', function(d) { return d.x; })
    .attr('cy', function(d) { return d.y; });


// Before we get into the force layout operation itself,
// we define a variable that indicates whether or not
// we're animating the operation. Initially it's false.

var animating = false;

// We'll also define a variable that specifies the duration
// of each animation step (in milliseconds).

var animationStep = 800;

// Next we define a function that executes at each
// iteration of the force layout.
function translateAlong(path) {
    var l = path.getTotalLength();
    return function(i) {
      return function(t) {
        var p = path.getPointAtLength(t * l);
        return "translate(" + p.x + "," + p.y + ")";//Move marker
      }}}
count = 1;

quadcon = 0;
quadlin = 10;
quadsq = -1;

force.on('tick', function() {

    // When this function executes, the force layout
    // calculations have been updated. The layout will
    // have set various properties in our nodes and
    // links objects that we can use to position them
    // within the SVG container.

    // First let's reposition the nodes. As the force
    // layout runs it updates the `x` and `y` properties
    // that define where the node should be centered.
    // To move the node, we set the appropriate SVG
    // attributes to their new values.

    // Because we want to emphasize how the nodes and
    // links move, we use a transition to move them to
    // their positions instead of simply setting the
    // values abruptly.

    quadoff = count*quadlin + count^2*quadsq + quadcon;

    count++;
    node.transition().ease('linear').duration(animationStep)
        .attr('cx', function(d) { return d.x + count*10; })
        .attr('cy', function(d) { return d.y + quadoff; });

    node.transition().ease('linear').duration(animationStep)
	.attrTween('transform',translateAlong(path.node()));

    // We also need to update positions of the links.
    // For those elements, the force layout sets the
    // `source` and `target` properties, specifying
    // `x` and `y` values in each case.

    // Here's where you can see how the force layout has
    // changed the `source` and `target` properties of
    // the links. Now that the layout has executed at least
    // one iteration, the indices have been replaced by
    // references to the node objects.


  

  
 
  

    // We only show one tick at a time, so stop the layout
    // for now.

    force.stop();

    // If we're animating the layout, continue after
    // a delay to allow the animation to take effect.

    if (animating) {
        setTimeout(
            function() { force.start(); },
            animationStep
        );
    }

});

// Now let's take care of the user interaction controls.
// We'll add functions to respond to clicks on the individual
// buttons.

// When the user clicks on the "Advance" button, we
// start the force layout (The tick handler will stop
// the layout after one iteration.)

d3.select('#advance').on('click', force.start);

// When the user clicks on the "Play" button, we're
// going to run the force layout until it concludes.

d3.select('#slow').on('click', function() {

    // Since the buttons don't have any effect any more,
    // disable them.

//    d3.selectAll('button').attr('disabled','disabled');

    // Indicate that the animation is in progress.

    animating = true;

    // Get the animation rolling

    force.start();

});
