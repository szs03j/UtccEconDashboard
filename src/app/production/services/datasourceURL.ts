
const _isDev = true;
let DataSourceURL = null;

const DataSourceURLDev = {
    import: '../assets/data/imports.csv' ,
    export: '../assets/data/exports.csv',
    potentialExport: '../../assets/data/exportPotential.csv',
    potentialImport: '../../assets/data/importPotential.csv',
    potentialExportLarge: '../../assets/data/exportPotentialLarge.csv',
    potentialImportLarge: '../../assets/data/importPotentialLarge.csv',
    potentialExportBox: '../../assets/data/exportPotentialLarge.csv',
    potentialImportBox: '../../assets/data/importPotentialLarge.csv',
    GDP: '../../assets/data/gdp.csv',
    exchangeRate: '../../assets/data/exchangeRate.csv',
    dailyExchangeRate: '../../assets/data/dailyExchangeRate.csv',
    geosea: '../assets/data/geosea.json',
};

const SERVER_URL = 'https://s3-ap-southeast-1.amazonaws.com/utcc-postprocessed/data/';

const DataSourceURLProd = {
    import: SERVER_URL + 'imports.csv',
    export: SERVER_URL + 'exports.csv',
    potentialExport: SERVER_URL + 'exportPotential.csv',
    potentialImport: SERVER_URL + 'importPotential.csv',
    potentialExportLarge: SERVER_URL + 'exportPotentialLarge.csv',
    potentialImportLarge: SERVER_URL + 'importPotentialLarge.csv',
    potentialExportBox: SERVER_URL + 'exportPotentialLarge.csv',
    potentialImportBox: SERVER_URL + 'importPotentialLarge.csv',
    GDP: SERVER_URL + 'gdp.csv',
    exchangeRate: SERVER_URL + 'exchangeRate.csv',
    dailyExchangeRate: SERVER_URL + 'dailyExchangeRate.csv',
    geosea: SERVER_URL + 'geosea.json',
};


if ( _isDev ) {
    DataSourceURL = DataSourceURLDev;
} else {
    DataSourceURL = DataSourceURLProd;
}

export { DataSourceURL };
