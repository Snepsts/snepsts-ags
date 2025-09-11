#! /bin/zsh

INSTALL_DIR=icons/hicolor/scalable/actions
NODE_MODULES_DIR=node_modules/@mdi/svg/svg

if [ -d ${INSTALL_DIR} ]; then
	echo "Icons detected. Deleting to re-install..."
	rm -rf icons
	echo "Done deleting!"
fi

if [ ! -d ${NODE_MODULES_DIR} ]; then
	echo "${NODE_MODULES_DIR} not found! Did you run 'npm i' yet?"
	echo "Error, must have ${NODE_MODULES_DIR} to install SVGs, please ensure you ran 'npm i'. Exiting."
	exit 1
fi

mkdir -p ${INSTALL_DIR}

SEARCH_DIR=${NODE_MODULES_DIR}
SEARCH_DIR_LENGTH=${#SEARCH_DIR}
LIB_FILE="lib/mdi-svg.ts"

echo "export type MdiSvgName =" > ${LIB_FILE}

find ${SEARCH_DIR} | while read -r file; do
	if [ -f ${file} ]; then
		FILE_LENGTH=${#file}
		FILE_NAME=${file}
		LENGTH_DIFF=$(( ${FILE_LENGTH} - ${SEARCH_DIR_LENGTH} ))
		NAME_TO_EXTRACT=${file:$((${SEARCH_DIR_LENGTH} + 1)):$((${LENGTH_DIFF} - 5))}
		SVG_NAME="${NAME_TO_EXTRACT}-symbolic"
		echo -e "\t| '${SVG_NAME}'" >> ${LIB_FILE}

		cp $file "${INSTALL_DIR}/${SVG_NAME}.svg"
	fi
done

echo "Done installing! Please check ${INSTALL_DIR} and ${LIB_FILE} to ensure the installation went well."
