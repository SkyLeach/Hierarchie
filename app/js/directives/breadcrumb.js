define(['angular', 'services'], function(angular, services) {
  'use strict';

  /* Bread crumb display directive
   * 
   * This code was modified from the example found at http://bl.ocks.org/kerryrodden/7090426
   * which is covered by the Apache v2.0 License. A copy of this license can be found in /directives
   * 
   * Developers: Do not remove this notification or license.
   */
  angular.module('recursiviz.directives')
    .directive('breadcrumb', ['d3Service', function(d3Service) {
        return {
          restrict: 'A',
          scope: {
            data: "=",
            currentnode: "="
          },
          link: function(scope) {
            d3Service.getD3(function(d3) {

              // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
              var b = {
                w: 100, h: 40, s: 3, t: 10
              };

              // Add the svg area.
              d3.select("#sequence").append("svg:svg")
                .attr("width", d3.select("#viz_panel")[0][0].clientWidth)
                .attr("height", b.h)
                .attr("id", "trail");

              scope.$on('updateBreadcrumb', function(ev, node, sequenceArray) {
                updateBreadcrumbs(sequenceArray, node.words[0]);
              });

              scope.$on('hideBreadcrumb', function() {
                d3.select("#trail")
                  .style("visibility", "hidden");
              });

              // Generate a string that describes the points of a breadcrumb polygon.
              function breadcrumbPoints(d, i) {
                var points = [];
                points.push("0,0");
                points.push(b.w + ",0");
                if (d.children) // non-pointed end for terminal nodes
                  points.push(b.w + b.t + "," + (b.h / 2));
                points.push(b.w + "," + b.h);
                points.push("0," + b.h);
                if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
                  points.push(b.t + "," + (b.h / 2));
                }
                return points.join(" ");
              }
              // Update the breadcrumb trail to show the current sequence and percentage.
              function updateBreadcrumbs(nodeArray, percentageString) {

                // Data join; key function combines name and depth (= position in sequence).
                var g = d3.select("#trail")
                  .selectAll("g")
                  .data(nodeArray, function(d) {
                    return d.words[0] + d.depth;
                  });

                // Add breadcrumb and label for entering nodes.
                var entering = g.enter().append("svg:g");

                entering.append("svg:polygon")
                  .attr("points", breadcrumbPoints)
                  .style("fill", function(d) {
                    return d.color;
                  });

                entering.append("svg:text")
                  .attr("x", (b.w + b.t) / 2)
                  .attr("y", b.h / 2)
                  .attr("dy", "0.35em")
                  .attr("text-anchor", "middle")
                  .text(function(d) {
                    return d.words[0];
                  });

                // Set position for entering and updating nodes.
                g.attr("transform", function(d, i) {
                  return "translate(" + i * (b.w + b.s) + ", 0)";
                });

                // Remove exiting nodes.
                g.exit().remove();

                // Make the breadcrumb trail visible, if it's hidden.
                d3.select("#trail")
                  .style("visibility", "");
              }
            });
          }
        };
      }]);
});
