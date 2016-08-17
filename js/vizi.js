// Define the dimensions of the visualization. We're using
// a size that's convenient for displaying the graphic on
// http://jsDataV.is

var width = 800,
height = 800;

// Before we do anything else, let's define the data for the visualization.

// Here's were the code begins. We start off by creating an SVG
// container to hold the visualization. We only need to specify
// the dimensions for this container.

var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

// Extract the nodes and links from the data.


d3.json("Comp02_1_3_node.json",function(error,graph){
    if (error) throw error;
    graph2 = graph;
    fullnodes = graph.nodes;
    fulllinks = graph.edges;

    
    var netselect = [1,2,3,4,5,6,7];
    
    fulllinks = fulllinks.filter(function(d,i){
	if (//fullnodes[d.source].yeonet != fullnodes[d.target].yeonet &&
	    netselect.indexOf(fullnodes[d.source].yeonet) != -1 && 
		netselect.indexOf(fullnodes[d.target].yeonet) != -1){
	    return true
	} else {return false}
    })
    

    
    nodemask = [];
    nodes = fullnodes.filter(function(d,i){
	if 
	    (fulllinks.map(e => e.source).indexOf(i) != -1 ||
	     fulllinks.map(e => e.target).indexOf(i) != -1) 	    {
		nodemask.push(i);
		return true
	    }else{return false}
    })

    newnodes = []; // only works if nodes are sorted
    for (var i = 0; i < nodemask.length; i++){
	newnodes.push(i);
    }
    
    fulllinks.forEach(function(d,i){
	if ( nodemask.indexOf(d.source) != -1 || nodemask.indexOf(d.target) != -1){ // if source and target are good
	    d.source = nodemask.indexOf(d.source); // update source
	    d.target = nodemask.indexOf(d.target); // update target
	} 
    })

    links = fulllinks.filter(function(d,i){
	if (newnodes.indexOf(d.source) != -1 && newnodes.indexOf(d.target) != -1){
	    return true
	} else {return false}
    })

    nodes.forEach(function(d){
	d.x = width/2 + (Math.random() -.5) * 100;
	d.y = height/2 + (Math.random() -.5) * 100;
    })

    links.forEach(function(d){
	d.targetlength = 100 + 50*(-1*d.conn);

    })



    // Now we create a force layout object and define its properties.
    // Those include the dimensions of the visualization and the arrays
    // of nodes and links.

    force = d3.layout.force()
	.size([width, height])
	.charge(-30)
	.linkStrength(.9)
	.linkDistance(function(d) {return d.targetlength})
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

    // var link = svg.selectAll('.link')
    // 	.data(links)
    // 	.enter().append('line')
    // 	.style('stroke','white')
    // 	.attr('class', 'link')
    // 	.attr('x1', function(d) { return nodes[d.source].x; })
    // 	.attr('y1', function(d) { return nodes[d.source].y; })
    // 	.attr('x2', function(d) { return nodes[d.target].x; })
    // 	.attr('y2', function(d) { return nodes[d.target].y; });

    // Now it's the nodes turn. Each node is drawn as a circle and
    // given a radius and initial position within the SVG container.
    // As is normal with SVG circles, the position is specified by
    // the `cx` and `cy` attributes, which define the center of the
    // circle. We actually don't have to position the nodes to start
    // off, as the force layout is going to immediately move them.
    // But this makes it a little easier to see what's going on
    // before we start the layout executing.

    node = svg.selectAll('.node')
	.data(nodes)
	.enter().append('circle')
	.attr('class', 'node')
	.style('fill', function(d,i) {
	    return d.color})
	.attr('r', width/200)
	.attr('cx', function(d) { return d.x; })
	.attr('cy', function(d) { return d.y; });

    // Before we get into the force layout operation itself,
    // we define a variable that indicates whether or not
    // we're animating the operation. Initially it's false.

    var animating = false;

    // We'll also define a variable that specifies the duration
    // of each animation step (in milliseconds).

    var animationStep = 1000;

    // Next we define a function that executes at each
    // iteration of the force layout.



    force.on('tick', function() {
	force.start()


	node.transition().ease('linear').duration(animationStep)
    	    .attr('cx', function(d) { return d.x; })
    	    .attr('cy', function(d) { return d.y; });

	// 	We only show one tick at a time, so stop the layout
	// 	for now.
	
	force.stop();

	// 	If we're animating the layout, continue after
	// 	a delay to allow the animation to take effect.

    	if (animating) {
    	    setTimeout(
    		function() { force.start(); },
    		animationStep
    	    );
    	}
    })



    // Now let's take care of the user interaction controls.
    // We'll add functions to respond to clicks on the individual
    // buttons.

    // When the user clicks on the "Advance" button, we
    // start the force layout (The tick handler will stop
    // the layout after one iteration.)

    d3.select('#advance').on('click', force.start);

    d3.select('#stop').on('click', force.stop);
    // When the user clicks on the "Play" button, we're
    // going to run the force layout until it concludes.

    d3.select('#slow').on('click', function() {

	// Since the buttons don't have any effect any more,
	// disable them.

//	d3.selectAll('button').attr('disabled','disabled');

	// Indicate that the animation is in progress.

	animating = true;

	// Get the animation rolling

	force.start();
    })


});






