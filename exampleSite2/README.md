# Lotus Docs Example Site
Example using same structure as our actual docs site. Itr does not contain the actual docs themselves however.

# Folder Structure

lang / product / version / subversion (optional)
* **product** must also have it's own hugo `toml` file
* **version** must be defined in the `toml` for it to show up in the version dropdown and work properly in the searchbar
* **subversion** (optional) must also be defined in the `toml` for each version they are used in by defining a `subversions` array
  * The `_index` file at the root of subversion's folder must also contain the following to work in sidebar/search:
```
params:
  subversion: v1 (< the subversion's folder name)
```

# Using

1. [Install Hugo](https://gohugo.io/overview/installing/)
2. Clone this repository

    ```bash
    $ git clone --depth 1 https://github.com/colinwilson/lotusdocs lotusdocs
    $ cd lotusdocs/exampleSite
    ```
3. Run Hugo server (using a respective toml file).

    ```bash
    $ hugo server -D --config=hugo-mesh-core.toml
    ```
## Notes:

The `exampleSite2` functions by using the Hugo [`replace`](https://gohugo.io/hugo-modules/use-modules/#make-and-test-changes-in-a-module) directive (in [`go.mod`](go.mod#L10)) to point the default the theme at the root of this repo