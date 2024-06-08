import './MapLegend.css';

export const MapLegend = () => {
    const pm25Levels = [
        { value: 6, label: '6', position: '5%' },
        { value: 23.75, label: '23.75', position: '20%' },
        { value: 45.5, label: '45.5', position: '35%' },
        { value: 103, label: '103', position: '55%' },
        { value: 200.5, label: '200.5', position: '80%' },
        { value: 250, label: '250', position: '90%' },
    ];

    return (
        <div className='legend-container'>
            <div className='legend'>
                {pm25Levels.map((level, index) => (
                    <div key={index} className='legend-mark' style={{ bottom: level.position }} />
                ))}
            </div>
            <div className='legend-labels'>
                {pm25Levels.map((level, index) => (
                    <div key={index} className='legend-label' style={{ bottom: level.position }}>
                        {level.label}
                    </div>
                ))}
            </div>
        </div>
    );
};
