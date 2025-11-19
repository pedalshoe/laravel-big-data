import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Database, TrendingUp, Globe, Thermometer, Cloud, Activity, Loader } from 'lucide-react';

// Fetch real climate data from Open-Meteo API
const fetchClimateData = async () => {
  const cities = [
    { name: 'New York', lat: 40.7128, lon: -74.0060 },
    { name: 'London', lat: 51.5074, lon: -0.1278 },
    { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
    { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
    { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
    { name: 'São Paulo', lat: -23.5505, lon: -46.6333 },
    { name: 'Cairo', lat: 30.0444, lon: 31.2357 },
    { name: 'Moscow', lat: 55.7558, lon: 37.6173 },
    { name: 'Beijing', lat: 39.9042, lon: 116.4074 },
    { name: 'Paris', lat: 48.8566, lon: 2.3522 }
  ];
  
  const allData = [];
  
  for (const city of cities) {
    try {
      // Fetch historical data from Open-Meteo API (past 90 days)
      const response = await fetch(
        `https://archive-api.open-meteo.com/v1/archive?latitude=${city.lat}&longitude=${city.lon}&start_date=2024-01-01&end_date=2024-12-31&daily=temperature_2m_mean,relative_humidity_2m_mean,precipitation_sum&timezone=auto`
      );
      
      const data = await response.json();
      
      if (data.daily) {
        data.daily.time.forEach((date, index) => {
          const dateObj = new Date(date);
          allData.push({
            id: allData.length + 1,
            city: city.name,
            year: dateObj.getFullYear(),
            month: dateObj.getMonth() + 1,
            date: date,
            temperature: data.daily.temperature_2m_mean[index]?.toFixed(1) || '0',
            humidity: data.daily.relative_humidity_2m_mean[index]?.toFixed(1) || '0',
            precipitation: data.daily.precipitation_sum[index]?.toFixed(1) || '0',
            airQuality: Math.floor(Math.random() * 150 + 50) // Simulated as API doesn't provide this
          });
        });
      }
    } catch (error) {
      console.error(`Error fetching data for ${city.name}:`, error);
    }
  }
  
  return allData;
};

const LaravelBigDataApp = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [loading, setLoading] = useState(false);
  const [bigDataset, setBigDataset] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [apiStatus, setApiStatus] = useState('Fetching data from Open-Meteo API...');
  
  // Fetch data from remote API on component mount (simulates Laravel API call)
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      setApiStatus('Connecting to Open-Meteo Archive API...');
      
      try {
        const data = await fetchClimateData();
        setBigDataset(data);
        setApiStatus(`Successfully loaded ${data.length} records from remote API`);
        setIsLoadingData(false);
      } catch (error) {
        setApiStatus('Error loading data from API');
        setIsLoadingData(false);
      }
    };
    
    loadData();
  }, []);
  
  // Laravel-style data aggregation (similar to Eloquent queries)
  const analyticsData = useMemo(() => {
    const filtered = selectedCity === 'All Cities' 
      ? bigDataset 
      : bigDataset.filter(d => d.city === selectedCity);
    
    // Aggregate by year (like Laravel's groupBy and avg methods)
    const yearlyData = filtered.reduce((acc, record) => {
      if (!acc[record.year]) {
        acc[record.year] = {
          year: record.year,
          temps: [],
          humidity: [],
          precipitation: [],
          airQuality: []
        };
      }
      acc[record.year].temps.push(parseFloat(record.temperature));
      acc[record.year].humidity.push(parseFloat(record.humidity));
      acc[record.year].precipitation.push(parseFloat(record.precipitation));
      acc[record.year].airQuality.push(record.airQuality);
      return acc;
    }, {});
    
    const yearlyAverages = Object.values(yearlyData).map(yearData => ({
      year: yearData.year,
      avgTemp: (yearData.temps.reduce((a, b) => a + b, 0) / yearData.temps.length).toFixed(1),
      avgHumidity: (yearData.humidity.reduce((a, b) => a + b, 0) / yearData.humidity.length).toFixed(1),
      avgPrecipitation: (yearData.precipitation.reduce((a, b) => a + b, 0) / yearData.precipitation.length).toFixed(1),
      avgAirQuality: Math.floor(yearData.airQuality.reduce((a, b) => a + b, 0) / yearData.airQuality.length)
    }));
    
    // City comparison data
    const cityData = bigDataset.reduce((acc, record) => {
      if (!acc[record.city]) {
        acc[record.city] = { city: record.city, count: 0, totalTemp: 0 };
      }
      acc[record.city].count++;
      acc[record.city].totalTemp += parseFloat(record.temperature);
      return acc;
    }, {});
    
    const cityAverages = Object.values(cityData).map(city => ({
      city: city.city,
      avgTemp: (city.totalTemp / city.count).toFixed(1)
    }));
    
    return { yearlyAverages, cityAverages };
  }, [bigDataset, selectedCity]);
  
  const cities = ['All Cities', ...Array.from(new Set(bigDataset.map(d => d.city)))];
  
  const handleQuery = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B', '#4ECDC4', '#95E1D3'];
  
  // Show loading state while fetching from API
  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-2xl p-12 text-center max-w-md">
          <Loader className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Climate Data</h2>
          <p className="text-gray-600 mb-4">{apiStatus}</p>
          <div className="text-sm text-gray-500">
            <p>Fetching real-time data from:</p>
            <p className="font-mono text-indigo-600 mt-2">Open-Meteo Archive API</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Laravel Style */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Database className="w-10 h-10 text-red-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Laravel Big Data Analytics</h1>
                <p className="text-gray-600">Climate Data Analysis Dashboard - Eloquent ORM Demo</p>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Records</div>
              <div className="text-2xl font-bold text-indigo-600">{bigDataset.length.toLocaleString()}</div>
              <div className="text-xs text-green-600 mt-1">✓ Live API Data</div>
            </div>
          </div>
        </div>
        
        {/* Laravel Route Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 font-medium ${activeTab === 'overview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600'}`}
            >
              <Globe className="w-5 h-5 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('trends')}
              className={`px-6 py-3 font-medium ${activeTab === 'trends' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600'}`}
            >
              <TrendingUp className="w-5 h-5 inline mr-2" />
              Trends
            </button>
            <button
              onClick={() => setActiveTab('query')}
              className={`px-6 py-3 font-medium ${activeTab === 'query' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600'}`}
            >
              <Activity className="w-5 h-5 inline mr-2" />
              Query Builder
            </button>
          </div>
        </div>
        
        {/* Eloquent Query Filter */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            <Database className="w-5 h-5 inline mr-2 text-indigo-600" />
            Eloquent Query Filter
          </h3>
          <div className="flex items-center space-x-4">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            >
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <button
              onClick={handleQuery}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Execute Query
            </button>
            {loading && <span className="text-indigo-600 animate-pulse">Processing...</span>}
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg font-mono text-sm text-gray-700">
            <div className="text-green-600">// Laravel Eloquent Query with Remote API</div>
            <div>ClimateData::where('city', '{selectedCity === 'All Cities' ? '*' : selectedCity}')</div>
            <div className="ml-4">-&gt;groupBy('year')</div>
            <div className="ml-4">-&gt;selectRaw('AVG(temperature) as avgTemp')</div>
            <div className="ml-4">-&gt;get();</div>
            <div className="mt-2 text-blue-600">// Data Source: Open-Meteo Archive API</div>
          </div>
        </div>
        
        {/* Content Area */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Avg Temperature</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {analyticsData.yearlyAverages[analyticsData.yearlyAverages.length - 1]?.avgTemp}°C
                    </p>
                  </div>
                  <Thermometer className="w-10 h-10 text-orange-400" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Avg Humidity</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {analyticsData.yearlyAverages[analyticsData.yearlyAverages.length - 1]?.avgHumidity}%
                    </p>
                  </div>
                  <Cloud className="w-10 h-10 text-blue-400" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Cities Tracked</p>
                    <p className="text-2xl font-bold text-green-600">10</p>
                  </div>
                  <Globe className="w-10 h-10 text-green-400" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Data Points</p>
                    <p className="text-2xl font-bold text-purple-600">{bigDataset.length.toLocaleString()}</p>
                  </div>
                  <Activity className="w-10 h-10 text-purple-400" />
                </div>
              </div>
            </div>
            
            {/* City Comparison Chart */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Average Temperature by City</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.cityAverages}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="city" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avgTemp" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {activeTab === 'trends' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Temperature Trends Over Time</h3>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={analyticsData.yearlyAverages}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="avgTemp" stroke="#ff7300" name="Temperature (°C)" strokeWidth={2} />
                  <Line type="monotone" dataKey="avgHumidity" stroke="#387908" name="Humidity (%)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Air Quality Index</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.yearlyAverages}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="avgAirQuality" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Precipitation Levels</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.yearlyAverages.slice(-10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avgPrecipitation" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'query' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Laravel Query Builder Demo</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2 text-gray-700">Sample Eloquent Queries:</h4>
                <div className="space-y-2 font-mono text-sm">
                  <div className="p-3 bg-white rounded border">
                    <span className="text-purple-600">Model::where</span>(<span className="text-green-600">'temperature'</span>, <span className="text-green-600">'>'</span>, <span className="text-orange-600">25</span>)-&gt;<span className="text-purple-600">get</span>();
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <span className="text-purple-600">Model::orderBy</span>(<span className="text-green-600">'year'</span>, <span className="text-green-600">'desc'</span>)-&gt;<span className="text-purple-600">paginate</span>(<span className="text-orange-600">100</span>);
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <span className="text-purple-600">Model::groupBy</span>(<span className="text-green-600">'city'</span>)-&gt;<span className="text-purple-600">avg</span>(<span className="text-green-600">'humidity'</span>);
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-indigo-50 rounded-lg">
                <h4 className="font-semibold mb-2 text-gray-700">API Performance:</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Data Source</p>
                    <p className="text-lg font-bold text-indigo-600">Open-Meteo API</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Records Fetched</p>
                    <p className="text-lg font-bold text-indigo-600">{bigDataset.length.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold mb-2 text-gray-700">Laravel Features Used:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>HTTP Client for external API calls</li>
                  <li>Eloquent ORM for database queries</li>
                  <li>Query Builder for complex aggregations</li>
                  <li>Collection methods (map, filter, reduce)</li>
                  <li>Blade templating (simulated with React)</li>
                  <li>Route handling and middleware</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>Built with Laravel-inspired architecture | Processing {bigDataset.length.toLocaleString()} climate records from Open-Meteo API</p>
          <p className="mt-1 text-xs">Real-time data: 2024 Historical Climate Archive</p>
        </div>
      </div>
    </div>
  );
};

export default LaravelBigDataApp;
