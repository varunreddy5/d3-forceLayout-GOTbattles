var w=1000,
    h=650,
    margin={
      top:30,
      right:30,
      bottom:30,
      left:30
    },
    width=w-margin.left-margin.right,
    height=h-margin.top-margin.bottom;
var svg=d3.select("body")
.append("svg")
.attr({
  id:"chart",
  width:width,
  height:height
}),
    chart=svg.append("g")
.attr({transform:"translate("+margin.left+","+margin.top+")"});
d3.csv("data/battles.csv",function(error,links){
  if(error){
    console.log(error);
  }else if(links){
    console.log(links);
  }
  var nodes={};

  links.forEach(function(link){
    link.source=nodes[link.source] || (nodes[link.source]={name:link.source});
    link.target=nodes[link.target] || (nodes[link.target]={name:link.target}) ;
    link.value=+link.value;
  });
  console.log(nodes);
  var game=["win","loss"];
  chart.append("defs").selectAll("marker")
    .data(game)
    .enter()
    .append("marker")
    .attr({
    id:function(d){
      return d;
    },
    viewBox:"0 -5 10 10",
    refX:30,
    refY:-1,
    markerWidth:5,
    markerHeight:5,
    orient:"auto",
    fill:"#404040"
  })
    .append("path")
    .attr("d","M0,-5L10,0L0,5");
  var path=chart.append("g").selectAll("path")
  .data(links)
  .enter()
  .append("path")
  .attr("class",function(d,i){
    return "link "+ d.attacker_outcome;
  })
  .attr("marker-end",function(d){return "url(#"+d.attacker_outcome+")"});
  var node=chart.selectAll(".node")
  .data(d3.values(nodes))
  .enter()
  .append("g")
  .classed("node",true);
  node.append("image")
    .attr("xlink:href",function(d){
    return "img/"+d.name.toLowerCase()+".png";
  })
    .attr({
    x:function(d){return -25;},
    y:function(d){return -25;},
    width:50,
    height:50
  });

  var text=node.append("text")
  .attr({
    "text-anchor":"middle",
    y:-30
  })
  .classed("label",true)
  .text(function(d){
    console.log(d.name);
    return d.name;
  });

  var force=d3.layout.force()
  .size([width,height])
  .nodes(d3.values(nodes))
  .links(links)
  .linkDistance(200)
  .charge(-600)
  .gravity(0.1)
  .on("tick",tick)
  .start();

  function tick(){
    node.attr({
      transform:function(d){
        return "translate("+d.x+","+d.y+")";
      }
    })
      .call(force.drag);
    path.attr("d",function(d,i){
      var curve=d.battle_number*0.5;

      var dx=d.target.x-d.source.x,
          dy=d.target.y-d.source.y,
          dr=Math.sqrt(dx*dx*curve+dy*dy*curve);
      return "M"+
        d.source.x + ',' +
        d.source.y + " A " +
        dr + "," + dr + " 0 0,1" +//space before 0 is very important
        d.target.x + ","+
        d.target.y;
    });
  }
});
