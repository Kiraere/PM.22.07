const gulp = require('gulp'); // імпорт Gulp
const { src, dest } = require('gulp');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('cssnano');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const file_include = require('gulp-file-include');
const imagemin = require('gulp-imagemin');

// Dynamic import for gulp-imagemin
async function getImagemin() {
    const imagemin = await import('gulp-imagemin');
    return imagemin.default; // Use default export
}
gulp.task('styles', () => {
    return src('app/scss/**/*.scss') // Вибирає всі SCSS файли в app/scss
        .pipe(sass().on('error', sass.logError)) // Компілює SCSS у CSS
        .pipe(postcss([cssnano()])) // Мінімізує CSS
        .pipe(rename({ suffix: '.min' })) // Додає суфікс '.min' до файлу
        .pipe(dest('dist/css')); // Зберігає в папку dist/css
});

// const scss_task = () => {
//     return src('app/scss/*.scss') // Вибір усіх файлів SCSS
//         .pipe(concat('style.scss')) // Об'єднання всіх SCSS у один файл
//         .pipe(sass()) // Компіляція SCSS у CSS
//         .pipe(cssnano()) // Мінімізація CSS
//         .pipe(rename({suffix: '.min'})) // Додавання суфіксу .min до файлу
//         .pipe(dest('dist/css')) // Збереження результату як єдиного файлу
//         .pipe(browserSync.stream());
// };
// Minify SCSS
// gulp.task('sass', () => {
//     return src('app/scss/*.scss')
//         .pipe(sass().on('error', sass.logError))
//         .pipe(postcss([cssnano()]))
//         .pipe(rename({suffix: '.min'}))
//         .pipe(dest('dist/css'))
// });

// Minify JS
gulp.task('uglify', () => {
    return src('app/js/*.js')
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(dest('dist/js'))
});

// Include HTML files together
gulp.task('html', () => {
    return src('app/index.html')
        .pipe(file_include({
            prefix: '@@',
            basepath: '@file'}))
        .pipe(dest('dist'));
});
// Таск для автоматичного перезавантаження сторінки
// gulp.task("serve", function () {
//     browserSync.init({
//         server: {
//             baseDir: "./dist",
//         }
//     });
// Compress images
gulp.task('img', async () => {
    const imagemin = await getImagemin();
    return src('app/img/*', { encoding: false })
        .pipe(imagemin())
        .pipe(dest('dist/img'));
});

// Watcher
gulp.task('watch', () => {
    gulp.watch('app/scss/**/*.css', gulp.series('styles'));
    gulp.watch('app/js/*.js', gulp.series('uglify'));
    gulp.watch('app/index.html', gulp.series('html'));
    gulp.watch('app/html/*.html', gulp.series('html'));

});

// Update browser
gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: './dist',
        }
    });
    gulp.watch('./dist').on('change', browserSync.reload);
    gulp.watch('./data').on('change', browserSync.reload);
});

// Default task
gulp.task('default', gulp.series('html', 'styles', 'uglify', 'img', gulp.parallel('browser-sync', 'watch')));