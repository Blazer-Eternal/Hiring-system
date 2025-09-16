"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = __importStar(require("sequelize"));
const config_1 = require("../config");
const applicationStatusEnum_1 = require("../enums/applicationStatusEnum");
const sequelize = config_1.Database.sequelize;
const Applications = sequelize.define("Applications", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    candidateId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: "Candidates",
            key: "id",
        },
    },
    jobId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: "JobPositions",
            key: "id",
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    interviewId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: "Interviews",
            key: "id",
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    status: {
        type: Sequelize.ENUM(applicationStatusEnum_1.ApplicationStatusEnum.APPLIED, applicationStatusEnum_1.ApplicationStatusEnum.UNDER_REVIEW, applicationStatusEnum_1.ApplicationStatusEnum.INTERVIEW, applicationStatusEnum_1.ApplicationStatusEnum.HIRED, applicationStatusEnum_1.ApplicationStatusEnum.REJECTED),
        allowNull: false,
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
}, {
    timestamps: true,
});
exports.default = Applications;
