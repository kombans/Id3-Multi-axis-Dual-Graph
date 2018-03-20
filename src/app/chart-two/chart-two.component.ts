import * as noUiSlider from 'nouislider';
import { HttpClient } from '@angular/common/http';
import { Price } from './../price';
import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';



@Component({
  selector: 'app-chart-two',
  templateUrl: './chart-two.component.html',
  styleUrls: ['./chart-two.component.css']
})
export class ChartTwoComponent implements OnInit {

  weekdays = [
    'Sunday', 'Monday', 'Tuesday',
    'Wednesday', 'Thursday', 'Friday',
    'Saturday'
  ];

  months = [
    'January', 'February', 'March',
    'April', 'May', 'June', 'July',
    'August', 'September', 'October',
    'November', 'December'
  ];



  margin: any;

  width: number;

  height: number;

  svg: any;

  oilPrice: Price[] = new Array();

  mmddyyFormat = d3.timeParse('%m/%d/%Y');

  constructor(private http: HttpClient) { }

  ngOnInit() {
  

    var border=.8;
    //var padding =0;

    const chartDiv = document.getElementById('line-chart');

    this.width = chartDiv.clientWidth;
    this.height = chartDiv.clientHeight;

    this.margin = { top: 50, right: 50, bottom: 70, left: 50 };
    this.width = this.width - this.margin.left - this.margin.right;
    this.height = this.height - this.margin.top - this.margin.bottom;
   
    this. svg = d3.select("#line-chart")
    .append("svg")
    .attr("width",this.width)
    .attr("height",this.height)
    .attr("stroke","black")
    .attr("style", "outline: thick solid midnightblue;") 
    //.style("fill","black")
    .style("stroke-width", border)
  
   // this.svg = d3.select('#line-chart').append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')') ;
    
        // background
     
        var borderPath = this.svg.append("rect")
      .attr("x", 0)
      .attr("y", -120)
      .attr("width",this.width + this.margin.left - this.margin.right)
    .attr("height",this.height + this.margin.top + this.margin.bottom)
      //.style("stroke", "Black")
      .style("fill", "powderblue");
      //.style("stroke-width", border);
//
      
    this.http.get<[{}]>('./assets/txn-data.json').subscribe(data => {

      data.forEach((obj, index) => this.oilPrice.push(
        new Price(this.mmddyyFormat(obj['date']), obj['predicted'], obj['close'], obj['profit'], obj['action'])));

      const profit: Price[] = new Array();
      profit.push(new Price(this.oilPrice[0].date, 0, 0, 100 * 1000, ''));
      profit.push(new Price(this.oilPrice[10].date, 0, 0, 110 * 1000, ''));
      profit.push(new Price(this.oilPrice[20].date, 0, 0, 120 * 1000, ''));
      profit.push(new Price(this.oilPrice[30].date, 0, 0, 130 * 1000, ''));
      profit.push(new Price(this.oilPrice[40].date, 0, 0, 140 * 1000, ''));
      profit.push(new Price(this.oilPrice[50].date, 0, 0, 150 * 1000, ''));
      profit.push(new Price(this.oilPrice[60].date, 0, 0, 160 * 1000, ''));
      profit.push(new Price(this.oilPrice[70].date, 0, 0, 170 * 1000, ''));
      profit.push(new Price(this.oilPrice[80].date, 0, 0, 180 * 1000, ''));
      profit.push(new Price(this.oilPrice[90].date, 0, 0, 190 * 1000, ''));
      profit.push(new Price(this.oilPrice[100].date, 0, 0, 200 * 1000, ''));

      this.plotBarChart(profit);
      this.plotLineChart(this.oilPrice);


      const dateSlider = d3.select('#line-chart').append('div')
        .attr('class', 'noUi-target noUi-ltr noUi-horizontal')
        .attr('id', 'slider-date')
        .style('left', '50px')
        .style('width', this.width + 'px')
        .style('top', '15px')
        .style('height', '15px');

      const self = this;

      const divSlider = document.getElementById('slider-date');

      noUiSlider.create(divSlider, {
        connect: true,
        // Create two timestamps to define a range.
        range: {
          min: self.oilPrice[0].date.getTime(),
          max: self.oilPrice[self.oilPrice.length - 1].date.getTime()
        },

        // Steps of one week
        step: 24 * 60 * 60 * 1000,

        // Two more timestamps indicate the handle starting positions.
        start: [self.oilPrice[0].date.getTime(), self.oilPrice[self.oilPrice.length - 1].date.getTime()],

        // No decimals
        // format: wNumb({
        //   decimals: 0
        // })
      });


      divSlider['noUiSlider'].on('update', function (values, handle) {
        document.getElementById('dates').innerHTML = self.formatDate(new Date(+values[0])) + ' To ' + self.formatDate(new Date(+values[1]));
      });


    });
  }

  // Append a suffix to dates.
  // Example: 23 => 23rd, 1 => 1st.
  nth(d) {
    if (d > 3 && d < 21) {
      return 'th';
    }
    switch (d % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }

  // Create a string representation of the date.
  formatDate(date) {
    return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();


    // return this.weekdays[date.getDay()] + ', ' +
    //   date.getDate() + this.nth(date.getDate()) + ' ' +
    //   this.months[date.getMonth()] + ' ' +
    //   date.getFullYear();
  }

  /**
   *
   * @param str
   */
  timestamp(str) {
    return new Date(str).getTime();
  }

  /**
   *
   * @param data
   */
  plotLineChart(data: Price[]) {

    const xScale = d3.scaleBand<Date>().rangeRound([0, this.width]).padding(0.1);
    xScale.domain(this.oilPrice.map(function (d) { return d.date; }));


    const yScale = d3.scaleLinear()
      .domain(d3.extent(this.oilPrice, function (d) { return d.close; }))
      .range([this.height, 0]);


    const line = d3.line<Price>()
      .x(function (d: Price, i) { return xScale(d.date); })
      .y(function (d: Price) { return yScale(d.close); });
//Labeling Y0 axis
    this.svg.append('g')
      .attr('class', 'y axis')
      .call(d3.axisLeft(yScale));
      this.svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - this.margin.left)
        .attr("x",0 - (this.height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .style('fill', 'Midnightblue')
        .text("Price / Barrel(in $)");

    this.svg.append('path')
      .datum(this.oilPrice)
      .attr('class', 'line')
      .attr('d', line);

    const lineDots = this.svg.selectAll('.dot')
      .data(this.oilPrice)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', function (d, i) { return xScale(d.date); })
      .attr('cy', function (d) { return yScale(d.close); })
      .attr('r', 2);


    const div = d3.select('#line-chart').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    lineDots.attr('cx', function (d) {
      return xScale(d.date);
    })
      .attr('cy', function (d) {
        return yScale(d.close);
      })
      .on('mouseover', function (d) {
        const formatMinute = d3.timeFormat('%Y-%m-%d %I:%M');
        div.transition()
          .duration(200)
          .style('opacity', .9)
          .style('visibility', 'visible');
        div.html(
          '<h4>' + formatMinute(d.date) + '</h4>' +
          '<p>' + 'Price : $ ' + d.close + '</p>'
        ).style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY - 28) + 'px');
      })
      .on('mouseout', (d) => {
        div.transition()
          .duration(500)
          .style('opacity', 0);
      });

  }

  /**
   *
   * @param data
   */
  plotBarChart(data: Price[]) {


    const x = d3.scaleBand<Date>().rangeRound([0, this.width]).padding(0.1);
    x.domain(this.oilPrice.map(function (d) { return d.date; }));

    const y = d3.scaleLinear().range([this.height, 0]);

    const yAxis = d3.axisLeft(y);



    y.domain([95000, 205000]);

    const xAxis = d3.axisBottom(x)
      .tickFormat(d3.timeFormat('%Y-%m-%d'))
      .tickValues(x.domain().filter(function (d, i) { return !(i % 4); }));

    this.svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '-.55em')
      .attr('transform', 'rotate(-45)');
//labeling X axis
      this.svg.append("text")
      .attr("y",  this.height+50)
      .attr("x", this.margin.bottom+this.width/2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .style('fill', 'Midnightblue')
      .text("Time(Period)");
     
    this.svg.append('g')
      .attr('class', 'axisRed')
      .attr('transform', 'translate( ' + this.width + ', 0 )')
      .call(d3.axisRight(y));

      this.svg.append("text")
        .attr("transform", "rotate(270)")
        .attr("y",  this.margin.left+1090)
        .attr("x",0 - (this.height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .style('fill', 'Midnightblue')
        .text("Net Capital (in $) ");

      //Legends
        const legendVals2 = ['Predicted', 'Actual','Bar','Line']
        const color = ['#e77f00', '#0093D1','#b0c4de','#87cefa'];

        let dataL = 0;
        const offset = 80;

        const legend4 = this.svg.selectAll('.legends4')
            .data(legendVals2)
            .enter().append('g')
            .attr('class', 'legends4')
            .attr('transform', function (d, i) {
                if (i === 0) {
                    dataL = d.length + offset
                    return 'translate(0,0)'
                } else {
                    const newdataL = dataL
                    dataL += d.length + offset
                    return 'translate(' + (newdataL) + ',0)'
                }
            })

        legend4.append('rect')
            // .attr('x', this.width - 180)
            .attr('x', 25)
            .attr('y', 0)
            .attr('width', 10)
            .attr('height', 10)
            .style('fill', function (d, i) {
                return color[i]
            })

        legend4.append('text')
            // .attr('x', this.width - 165)
            .attr('x', 40)
            .attr('y', 10)
            //.attr('dy', '.35em')
            .text(function (d, i) {
                return d
            })
            .attr('class', 'textselected')
            .style('text-anchor', 'start')
            .style('font-size', 15)
            .style("font-weight", "bold")


            //
    const self = this;

    const tooltip = d3.select('#line-chart').append('div').attr('class', 'tooltip');

    this.svg.selectAll('bar')
      .data(data)
      .enter().append('rect')
      .style('fill', 'Darkslateblue')
      .attr('x', function (d) { return x(d.date); })
      .attr('width', x.bandwidth())
      .attr('y', function (d) { return y(d.profit); })
      .attr('height', function (d) { return self.height - y(d.profit); })
      .on('mousemove', function (d) {
        const formatMinute = d3.timeFormat('%Y-%m-%d %I:%M');
        tooltip
          .style('left', d3.event.pageX - 50 + 'px')
          .style('top', d3.event.pageY - 95 + 'px')
          .style('visibility', 'visible')
          .style('display', 'inline-block')
          .html('<h4>' + formatMinute(d.date) + '</h4>' +
            '<p>' + 'Asset Value : $ ' + d.profit + '</p>')
            .style("font-weight", "bold");
      })
      .on('mouseout', function (d) {
        tooltip.style('display', 'none');
      });
  }

}
