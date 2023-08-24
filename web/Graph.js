anychart.onDocumentReady(function () {
  fetch("graph.json")
    .then((response) => response.json())
    .then((data) => {
      var chart = anychart.graph();

      chart.data(data);
      chart.title().enabled(true).text("UBC Coursemap");

      var edgeConfig = {
        normal: {stroke: {thickness: 1, color: 'lightgrey'}},
        hovered: {stroke: {thickness: 2, color: 'blue'}},
        selected: {stroke: {thickness: 2, color: 'blue'}},
        tooltip: {enabled:true, format: '{%from} --> {%to}'}
      };
      var nodeConfig = {
        normal: {stroke: {thickness: 2, color: "black"}, fill: "#F0F0F0"},
        hoevered: {stroke: {thickness: 3, color: "#CFCFCF"}},
        selected: {stroke: {thickness: 1, color: 'darkblue'}, fill: 'blue'}
      }
      chart.edges(edgeConfig);
      chart.nodes(nodeConfig);
      chart.layout().type('fixed');
      chart.interactivity().nodes(false); // disallow moving nodes


      chart.listen('click', function(e) {
        var tag = e.domTarget.tag;

        if ( !tag ) return;

        console.log(`Clicked ${tag.type} with ID ${tag.id}`);

        if (tag.type != 'node') return;

        console.log(tag);
      
        var node;
        for (let i = 0; i < data['nodes'].length; i++) {
          if(data['nodes'][i]['id'] != tag.id) continue;
          node = data['nodes'][i];
        }

        document.getElementById('course-name').innerHTML = `${node.id} (${node.credits}) - ${node.title}`
        document.getElementById('course-desc').innerHTML = node.desc; 
      })

      document.body.addEventListener('keypress', function(e) {
        // check if the element is an `input` element and the key is `enter`
        if(e.target.nodeName !== "INPUT" || e.key !== 'Enter') return;
        var name = e.target.value;
        var node;
        var found = false;

        var data_at_nodes = data['nodes'];
        for(let i = 0; i < data_at_nodes.length; i++) {
          if(data_at_nodes[i]['id'] != name) continue;
          node = data['nodes'][i]
          found = true;
          break;
        }

        if(!found) return;
        console.log(`Found course with id: ${name}`);
        document.getElementById('course-name').innerHTML = `${node.id} (${node.credits}) - ${node.title}`
        document.getElementById('course-desc').innerHTML = node.desc;

        chart.unselect();
        chart.select(name);
        chart.select('edge')
      });


      chart.container("container").draw();
    });
});
