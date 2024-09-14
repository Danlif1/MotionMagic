import React from 'react';
import { Page, Text, View, StyleSheet, Font,Image } from '@react-pdf/renderer';
import * as math from 'mathjs';
import katex from 'katex';

const styles = StyleSheet.create({
    page: {
        padding: 20,
    },
    section: {
        marginBottom: 10,
    },
    text: {
        fontSize: 12,
        marginBottom: 5,
    },
    table: {
        display: 'table',
        width: 'auto',
        margin: 10,
        borderStyle: 'solid',
        borderWidth: 1,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableCol: {
        width: '25%',
        borderStyle: 'solid',
        borderWidth: 1,
        padding: 5,
    },
    tableCell: {
        fontSize: 10,
    },
});

const ev_expr = (str, scope) => {
    try {
        return math.evaluate(str, scope);
    } catch (e) {
        console.log(e);
        return '';
    }
};


const FullSolutionPDF = ({ problem }) => {
    var clone = problem.Solution[0].slice()
    console.log(problem.FinalSolution)
    clone.splice(-1,1,'We get that the final solution is '+Object.entries(problem.FinalSolution).map(([key, value]) => `${key}=${value}`).join(', '))
    return (
        <Page style={styles.page}>
            {/* Equations Section */}
            <View style={styles.section}>
                <Text style={styles.text}>Equations:</Text>
                {problem.Equations.map((equation, index) => (
                    <Text key={index} style={styles.text}>{equation}</Text>
                ))}
            </View>

            {/* Solution Steps Section */}
            <View style={styles.section}>
                <Text style={styles.text}>Solution Steps:</Text>
                {clone.map((response, index) => (
                    <View key={index} style={styles.section}>
                        {response.split('\n').map((line, idx) => (
                            <Text key={idx} style={styles.text}>{line}</Text>
                        ))}
                    </View>
                ))}

            </View>

            {/* Tables Section */}
            {problem.Riders && problem.Paths && (
                <View style={styles.section}>
                    <Text style={styles.text}>Tables:</Text>
                    {problem.Riders.map((rider, riderIndex) => (
                        <View key={riderIndex} style={styles.section}>
                            <Text style={styles.text}>{rider.Name}'s Table</Text>
                            {/* Table structure */}
                            <View style={styles.table}>
                                <View style={styles.tableRow}>
                                    <View style={styles.tableCol}><Text style={styles.tableCell}>Path</Text></View>
                                    <View style={styles.tableCol}><Text style={styles.tableCell}>Time</Text></View>
                                    <View style={styles.tableCol}><Text style={styles.tableCell}>Velocity</Text></View>
                                    <View style={styles.tableCol}><Text style={styles.tableCell}>Distance</Text></View>
                                </View>
                                {problem.Paths.map((path, pathIndex) => (
                                    <View key={pathIndex} style={styles.tableRow}>
                                        <View style={styles.tableCol}>
                                            <Text style={styles.tableCell}>{path}</Text>
                                        </View>
                                        <View style={styles.tableCol}>
                                            <Text style={styles.tableCell}>
                                                {problem.RidersData[rider.Name]?.[pathIndex]?.Time || ''}
                                            </Text>
                                        </View>
                                        <View style={styles.tableCol}>
                                            <Text style={styles.tableCell}>
                                                {problem.RidersData[rider.Name]?.[pathIndex]?.Velocity || ''}
                                            </Text>
                                        </View>
                                        <View style={styles.tableCol}>
                                            <Text style={styles.tableCell}>
                                                {problem.RidersData[rider.Name]?.[pathIndex]?.Distance || ''}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>
            )}

            {/* Final Solutions Section */}
            {/*{problem.FinalSolution && (*/}
            {/*    <View style={styles.section}>*/}
            {/*        <Text style={styles.text}>Final Solutions:</Text>*/}
            {/*        <Text style={styles.text}>*/}
            {/*            {Object.entries(problem.FinalSolution).map(([key, value]) => `${key} = ${value}`).join(', ')}*/}
            {/*        </Text>*/}
            {/*    </View>*/}
            {/*)}*/}

            {/* Final Evaluated Table */}
            <View style={styles.section}>
                <Text style={styles.text}>Final Evaluated Table:</Text>
                {problem.Riders.map((rider, riderIndex) => (
                    <View key={riderIndex} style={styles.section}>
                        <Text style={styles.text}>{rider.Name}'s Evaluated Table</Text>
                        <View style={styles.table}>
                            <View style={styles.tableRow}>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>Path</Text></View>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>Time</Text></View>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>Velocity</Text></View>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>Distance</Text></View>
                            </View>
                            {problem.Paths.map((path, pathIndex) => (
                                <View key={pathIndex} style={styles.tableRow}>
                                    <View style={styles.tableCol}>
                                        <Text style={styles.tableCell}>{path}</Text>
                                    </View>
                                    <View style={styles.tableCol}>
                                        <Text style={styles.tableCell}>
                                            {ev_expr(problem.RidersData[rider.Name][pathIndex].Time, problem.FinalSolution)}
                                        </Text>
                                    </View>
                                    <View style={styles.tableCol}>
                                        <Text style={styles.tableCell}>
                                            {ev_expr(problem.RidersData[rider.Name][pathIndex].Velocity, problem.FinalSolution)}
                                        </Text>
                                    </View>
                                    <View style={styles.tableCol}>
                                        <Text style={styles.tableCell}>
                                            {ev_expr(problem.RidersData[rider.Name][pathIndex].Distance, problem.FinalSolution)}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </View>
        </Page>
    );
};

export default FullSolutionPDF;
