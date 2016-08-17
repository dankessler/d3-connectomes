
// Define the dimensions of the visualization. We're using
// a size that's convenient for displaying the graphic on
// http://jsDataV.is

var width = 640,
    height = 480;


var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);


svg.append('svg:path')
    .attr('d','M 100,250 Q 250,100 400,250')
    .attr('stroke','blue')
    .attr('fill','white')
    .attr('stoke-width',2)



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


force.linkDistance(function(d,i){
  if (d.source.type != d.target.type){
    return 70 + Math.random()*30
  }else{
    return 30 - Math.random()*10
  }
});



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


function translateAlong(path,count) {
    var l = path.getTotalLength();
    return function(i) {
      return function(t) {
        var p = path.getPointAtLength(t* (count/total) * l);
        return "translate(" + p.x + "," + p.y + ")";//Move marker
      }}}

count = 0;
total = 20 - 1;

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



    node.transition().ease('linear').duration(animationStep)
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; });


    node.transition().ease('linear').duration(animationStep)
	.attrTween('transform',translateAlong(path.node(),count));

    count++;  

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
