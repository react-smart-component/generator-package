/**
 * @since 2017-07-11 20:09
 * @author chenyiqin
 */

const path = require('path');
const Generator = require('yeoman-generator');

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);

        this.option('version', {
            desc: 'version of package',
            type: String,
            defaults: '0.0.1',
        });

        this.option('author', {
            desc: 'author of package',
            type: String,
            default: '',
        });

        this.option('pkgName', {
            desc: 'name of package',
            type: String,
            defaults: ''
        });

        this.option('repo', {
            desc: 'git repositry url of package',
            type: String,
            default: '',
        });

        this.option('homePage', {
            desc: 'homePage of package',
            type: String,
            default: '',
        });
    }

    initialize() {
        const {
            appname,
            options,
        } = this;
        this.appname = appname.replace(/\s/g, '-');
        this._packageName = options.pkgName || appname;
        this._author = options.author;
        this._repo = options.repo || `https://github.com/cyqresig/${appname}`;
        this._version = options.version;
        this._homepage = options.homePage || this._repo;
        this.log(`   initializing ${this.appname}`);
    }

    write() {
        this._write();
    }

    _write() {
        const files = [
            'scripts',
            'src',
            'LICENSE',
            'CHANGELOG.md',
            'DEVELOPMENT.md',
            'README.md',
            'gitignore',
            'npmrc',
            '.editorconfig',
            '.travis.yml',
            '.babelrc',
            'package.json',
            'tsconfig.json',
            'tslint.json'
        ];
        const {
            appname,
            _packageName,
            _author,
            _repo,
            _version,
            _homepage,
        } = this;
        files.forEach((fileName) => {
            let newFileName = fileName;
            // https://github.com/npm/npm/issues/1862
            if (fileName === 'gitignore' || fileName === 'npmignore') {
                newFileName = fileName === 'gitignore' ? '.gitignore' : '.npmignore';
            } else if (fileName === 'npmrc') {
                newFileName = '.npmrc';
            }
            this.fs.copyTpl(
                this.templatePath(fileName),
                this.destinationPath(newFileName),
                {
                    appname,
                    _packageName,
                    _author,
                    _repo,
                    _version,
                    _homepage,
                }
            );
        });
    }

    end() {
        this.log('   ✨  done!');
        process.exit(-1);
    }
};
