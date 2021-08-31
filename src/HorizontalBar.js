import React from 'react';
import { HorizontalBar } from 'react-chartjs-2';



const options_vaccines = {
    legend: {
        display:false,
    },
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true,
            },
        },
    ],
},
}

let percentage = 100;
//let percentage = ( [data.country.vaccunated] / [data.country.vaccunated] ) * 100;

const data_vaccines = {
    labels: ['Vaccinated people'],
    datasets: [
        {
            label: '% vaccinated',
            data: [percentage],
            backgroundColor: [
                'rgba(255, 99, 132, 0.9)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1,
        },
    ],
}



function VaccinesGraph() {
    return (
        <HorizontalBar data={data_vaccines} options={options_vaccines} />
    )
}

export default VaccinesGraph;
