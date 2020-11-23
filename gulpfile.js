const path = require("path");
const { promisify } = require("util");
const { src, dest } = require("gulp");
const rename = require("gulp-rename");
const through2 = require("through2");

const liquid = require("liquid").Engine();
const frontmatter = require("gray-matter");
const sass = require("sass");

const OUTDIR = path.join(__dirname, "build");

async function assets() {}

function defaultTask(cb) {
	// place code for your default task here
	console.log("hey!!");
	cb();
}

function buildContent() {
	const extractFrontMatter = through2.obj((file, _, cb) => {
		const { content, data } = frontmatter(file.contents);
		file.content = content;
		file.frontmatter = data;
		cb(null, file);
	});

	const contentBuilder = through2.obj(async (file, _, cb) => {
		console.dir(file);
		if (file.frontmatter.layout) {
			const template = liquid.parse()
		}
		// if (file.isBuffer()) {
		// 	const { css } = sass.renderSync({ file: file.path });
		// 	file.contents = css;
		// }
		cb(null, file);
	});

	return src("content/**/**.html")
		.pipe(extractFrontMatter)
		.pipe(contentBuilder)
		.pipe(dest(path.join(OUTDIR)));
}

function buildSass() {
	const sassBuilder = through2.obj((file, _, cb) => {
		if (file.isBuffer()) {
			const { css } = sass.renderSync({ file: file.path });
			file.contents = css;
		}
		cb(null, file);
	});

	return src("css/*.scss")
		.pipe(sassBuilder)
		.pipe(rename(path => (path.extname = ".css")))
		.pipe(dest(path.join(OUTDIR, "css")));
}

module.exports = {
	default: defaultTask,
	sass: buildSass,
	content: buildContent,
};
