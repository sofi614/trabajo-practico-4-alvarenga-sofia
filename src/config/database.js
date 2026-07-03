import{sequelize} from `sequelize`;

const sequelize = new sequelize("movies","root","",{
    host:"localhost",
    dialect:"mysql"
});

export default sequelize;