/**
 * Composant de la carte de graphique radar.
 *
 * Ce composant affiche un graphique radar représentant les performances de l'utilisateur dans différentes catégories.
 *
 * @module RadarChartCard
 */

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from "react";
import apiService from '../../../../services/apiService';
import PropTypes from 'prop-types';
import './radarchart.scss';

/**
 * Fonction pour personnaliser le rendu des labels.
 *
 * @function
 * @param {Object} params - Les paramètres de la fonction.
 * @param {number} params.x - La position x du label.
 * @param {number} params.y - La position y du label.
 * @param {Object} params.payload - Les données du label.
 * @returns {JSX.Element} Le label personnalisé.
 */
const renderCustomLabel = ({ x, y, payload }) => {
    let offsetX = 0;
    let offsetY = 0;

    switch (payload.value) {
        case 'Intensité':
            offsetY = -10;
            break;
        case 'Endurance':
            offsetY = 10;
            break;
        case 'Cardio':
            offsetX = -20;
            break;
        case 'Vitesse':
            offsetX = 20;
            break;
        case 'Energie':
            offsetX = -20;
            break;
        case 'Force':
            offsetX = 20;
            break;
        default:
            break;
    }

    return (
        <text
            x={x + offsetX}
            y={y + offsetY}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#ffffff"
            fontSize={14}
        >
            {payload.value}
        </text>
    );
};

/**
 * Fonction pour calculer la valeur maximale initiale.
 *
 * @function
 * @param {Array} data - Les données de performance.
 * @returns {number} La valeur maximale.
 */
const getMaxValue = (data) => {
    return data.length > 0 ? Math.max(...data.map(item => item.value)) : 200;
};

/**
 * Composant fonctionnel pour la carte de graphique radar.
 *
 * @function
 * @name RadarChartCard
 * @param {Object} props - Les propriétés du composant.
 * @param {number} props.userId - L'ID de l'utilisateur.
 * @returns {JSX.Element} Le composant de la carte de graphique radar.
 */
function RadarChartCard({ userId }) {
    const [perfData, setPerfData] = useState([]);
    const [maxValue, setMaxValue] = useState(() => getMaxValue([]));

    useEffect(() => {
        apiService.getPerformanceData(userId)
            .then(data => {
                const validData = data.filter(item => item.kind && item.value !== undefined);
                setPerfData(validData);
                setMaxValue(getMaxValue(validData));
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des données:", error);
            });
    }, [userId]);

    RadarChartCard.propTypes = {
        userId: PropTypes.number.isRequired,
    }

    return (
        <div className="RadarChartWrapper">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={perfData} cx="50%" cy="50%" outerRadius="70%">
                    <PolarGrid stroke="#ffffff" radialLines={false} />
                    <PolarAngleAxis dataKey="kind" tickLine={false} tick={renderCustomLabel} />
                    <PolarRadiusAxis domain={[0, maxValue]} stroke="#ffffff" tick={false} axisLine={false} />
                    <Radar name="Performance" dataKey="value" fill="#ff0000" fillOpacity={0.6} />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default RadarChartCard;