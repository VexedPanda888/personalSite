import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as d3 from 'd3';


function GoPage() {
    const [profile, setProfile] = useState(null);
    const [isLoadingProfile, setLoadingProfile] = useState(true);
    const [isLoadingGames, setLoadingGames] = useState(true);
    const [error, setError] = useState(null);
    const [games, setGames] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileResponse = await fetch('https://online-go.com/api/v1/players/835089');
                const gamesResponse = await fetch('https://online-go.com/api/v1/players/835089/games');
                if (!profileResponse.ok || !gamesResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const profileData = await profileResponse.json();
                const gamesData = await gamesResponse.json();
                setProfile(profileData);
                setGames(gamesData);
                console.log(gamesData);
            } catch (error) {
                console.error('There was a problem fetching data:', error);
                setError(error.message);
            } finally {
                setLoadingProfile(false);
                setLoadingGames(false);
            }
        };
    
        fetchData();
    }, []);
    
    if (isLoadingProfile || isLoadingGames) {
        return <div>Loading...</div>;
    }
    
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <GoHeader profile={profile}/>
            <VolumeGraph rawData={games}  />
        </div>
    );
}

export default GoPage;

const VolumeGraph = ({ rawData }) => {
    const [data, setData] = useState([]);
  
    useEffect(() => {
      const processedData = processGameVolumeData(rawData);
      const visualizationData = convertForVisualization(processedData);
      setData(visualizationData);
    }, [rawData]);
  
    return (
      <div>
        <BarGraph data={data}/>
      </div>
    );
  };

const GoHeader = ({ profile }) => {
    return (
        <div className="App">
            <header className="App-header">
                <h2>This is where you can connect with me over Go and see fun data visualizations about my recent Go games!</h2>
                <div>
                    <p>Username: {profile.username}</p>
                    <p>OGS: { ratingToRank(profile.ratings.overall.rating) }</p>
                </div>
                <Link to="/" className="App-link">Go Back</Link>
            </header>
        </div>
    );
}

function ratingToRank(rating) {
    var rank = 0;
    const rankInt = parseInt(rating,10);
    const rankNum = Math.log(rankInt/850.0)/0.032;

    if (rankNum >= 30) {
        rank = (rankNum-21).toFixed(1) + "d";
    } else {
        rank = (23-rankNum).toFixed(1) + "k";
    }
    return rank;
}

function processGameVolumeData(data) {
    if (!data || !data.results) {
        console.error('Data is not available or not properly structured:', data);
        return []; // Return an empty array or appropriate default to handle this case gracefully
    }
    const gamesByDay = {};
  
    data.results.forEach(game => {
      const startDate = new Date(game.started);
      const dayKey = startDate.toISOString().split('T')[0]; // Get the date part only
  
      if (!gamesByDay[dayKey]) {
        gamesByDay[dayKey] = 0;
      }
      gamesByDay[dayKey]++;
    });
  
    return gamesByDay;
}

function convertForVisualization(gamesByDay) {
    return Object.keys(gamesByDay).map(day => ({
      date: day,
      count: gamesByDay[day]
    }));
  }

const BarGraph = ({ data }) => {
    const d3Container = useRef(null);

    useEffect(() => {
        if (data && d3Container.current) {
            const svg = d3.select(d3Container.current);

            // Set dimensions
            const margin = { top: 20, right: 30, bottom: 40, left: 90 };
            const width = 800 - margin.left - margin.right;
            const height = 500 - margin.top - margin.bottom;

            // Remove any previous graphs
            svg.selectAll("*").remove();

            // Create the SVG container
            const chart = svg.append('g')
                             .attr('transform', 
                                  `translate(${margin.left},${margin.top})`);

            // Set the scales
            const xScale = d3.scaleBand()
                             .range([0, width])
                             .domain(data.map(d => d.date))
                             .padding(0.1);

            const yScale = d3.scaleLinear()
                             .domain([0, d3.max(data, d => d.count)])
                             .range([height, 0]);

            // Draw the bars
            chart.selectAll(".bar")
                 .data(data)
                 .enter()
                 .append("rect")
                 .attr("class", "bar")
                 .attr("x", d => xScale(d.date))
                 .attr("y", d => yScale(d.count))
                 .attr("width", xScale.bandwidth())
                 .attr("height", d => height - yScale(d.count))
                 .attr("fill", "#69b3a2");

            // Add the X Axis
            chart.append("g")
                 .attr("transform", `translate(0,${height})`)
                 .call(d3.axisBottom(xScale))
                 .selectAll("text")
                 .style("text-anchor", "end")
                 .attr("dx", "-.8em")
                 .attr("dy", ".15em")
                 .attr("transform", "rotate(-65)");

            // Add the Y Axis
            chart.append("g")
                 .call(d3.axisLeft(yScale));
        }
    }, [data]); // Redraw graph when data changes

    return (
        <svg
            className="d3-component"
            width={800}
            height={500}
            ref={d3Container}
        />
    );
};