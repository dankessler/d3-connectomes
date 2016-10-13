(function() {
  packages = {

    // Lazily construct the package hierarchy from class names.
    root: function(classes,skipnets,skipsubnets,removenetworks) {
      var map = {};

	  if (removenetworks==null) { removenetworks = 1; }
      function find(name, data) {
        var node = map[name], i;
        if (!node) {
          node = map[name] = data || {name: name, children: []};
          if (name.length) {
            node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
            node.parent.children.push(node);
            node.key = name.substring(i + 1);
			if (node.subnetstring!=null && node.subnetstring!="") {
				node.subnetstring = node.parent.name;
				if (removenetworks==-1) {
					//grab first portion of name and remove it 
					var tempname = name.substring(0,i=name.indexOf(".")+1);
					node.subnetstring = node.subnetstring.replace(tempname,"");
				}
			}
          }
        }
        return node;
      }

	  var cursubnet="";
      classes.forEach(function(d) {
		d.subnetstring = "";
		if (d.subnet!=cursubnet) {
			cursubnet = d.subnet;
			d.subnetstring = d.subnet;
		}
		if (skipnets.indexOf(d.net)<0 & skipsubnets.indexOf(d.subnet)<0) {
        find(d.name, d);
		}
      });

      return map[""];
    },

    // Return a list of imports for the given array of nodes.
    imports: function(nodes) {
      var map = {},
          imports = [];

      // Compute a map from name to node.
      nodes.forEach(function(d) {
        map[d.name] = d;
      });

      // For each import, construct a link from the source to target node.
      nodes.forEach(function(d) {
		var idx = 0;
        if (d.imports) d.imports.forEach(function(i) {
			if (map[i]) {
			//if (map[d.name].net != map[i].net) {
          imports.push({source: map[d.name], target: map[i], color: d.value[idx++], sourcesubnet: d.subnet, targetsubnet: map[i].subnet});
		  //}
		  }
        });
      });

      return imports;
    }

  };
})();
