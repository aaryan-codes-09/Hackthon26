const mongoose = require('mongoose');

const FileNodeSchema = new mongoose.Schema({
  id:         { type: String, required: true },
  name:       { type: String, required: true },
  path:       { type: String },
  type:       { type: String, enum: ['entry','core','util','external','config'], default: 'config' },
  summary:    { type: String },
  imports:    [String],
  usedBy:     [String],
  highImpact: { type: Boolean, default: false },
  x:          { type: Number, default: 200 },
  y:          { type: Number, default: 200 },
}, { _id: false });

const OnboardingStepSchema = new mongoose.Schema({
  fileId:   String,
  filename: String,
  reason:   String,
}, { _id: false });

const AnalysisSchema = new mongoose.Schema({
  repoName:      { type: String, required: true },
  repoUrl:       { type: String },
  language:      { type: String },
  description:   { type: String },
  totalFiles:    { type: Number },
  totalModules:  { type: Number },
  linesOfCode:   { type: String },
  archSummary:   { type: String },
  stats: {
    entryPoints:          Number,
    coreModules:          Number,
    utilities:            Number,
    externalIntegrations: Number,
  },
  files:          [FileNodeSchema],
  onboardingPath: [OnboardingStepSchema],
  modules: {
    entries:   [String],
    core:      [String],
    utilities: [String],
    external:  [String],
  },
  queries: [{
    question:  String,
    answer:    String,
    createdAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Analysis', AnalysisSchema);
